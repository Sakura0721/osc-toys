from fastapi import APIRouter, HTTPException, status
import asyncio
from typing import List

from pydantic import BaseModel
from settings import settings
import time
from toys.estim.coyote.dg_interface import CoyoteInterface
from pythonosc.dispatcher import Dispatcher
from pythonosc import osc_server
from fastapi import BackgroundTasks


router = APIRouter(prefix="/api/coyote")


ci = CoyoteInterface(
    device_uid=settings.coyote_uid, power_multiplier=1.28, safe_mode=True
)

transport = None


async def start_channel_a():
    print(ci.patterns[settings.coyote_pattern_a])
    await ci.signal(
        power=int(settings.coyote_max_power_a * settings.min_power),
        pattern_name=settings.coyote_pattern_a,
        duration=100000000,
        channel="a",
    )


async def start_channel_b():
    print(ci.patterns[settings.coyote_pattern_b])
    await ci.signal(
        power=int(settings.coyote_max_power_b * settings.min_power),
        pattern_name=settings.coyote_pattern_b,
        duration=100000000,
        channel="b",
    )


async def serve_osc():
    global transport
    dispatcher = Dispatcher()
    dispatcher.map(settings.coyote_addr_a, coyote_handler_a, "A")
    dispatcher.map(settings.coyote_addr_b, coyote_handler_b, "B")
    server = osc_server.AsyncIOOSCUDPServer(
        (settings.vrc_host, settings.vrc_osc_port), dispatcher, asyncio.get_event_loop()
    )
    transport, _ = await server.create_serve_endpoint()
    print(transport)


param_queue_a = []
param_queue_b = []
last_time_a = time.time()
cur_time_a = time.time()
last_time_b = time.time()
cur_time_b = time.time()


def get_avg(queue: List[float]) -> float:
    """
              ▲
              │
              │
              │                max_limit
          1.0 │               xx───────
              │              xx
              │             xx
              │            xx
              │           xx
              │          xx
    min_power │   ┌─────xx
              │   │       min_limit
              └───┴──────────────────────────►
              start_limit
    """
    s = 0.0
    for x in queue:
        s += x
    s /= len(queue)
    if s <= settings.min_limit:
        # map [START_LIMIT, MIN_LIMIT] to MIN_OOWER
        s = settings.min_power
    elif s >= settings.min_limit:
        # map [MAX_LIMIT, 1] to 1
        s = 1
    else:
        # map [MIN_LIMIT, MAX_LIMIT] to [MIN_POWER, 1]
        s = (s - settings.min_limit) / (settings.max_limit - settings.min_limit) * (
            1 - settings.min_power
        ) + settings.min_power
    return s


def coyote_handler_a(addr, args, dis):
    """
    This function will calculate the avarage value of values from OSC
    within 1 second, and then set the power of the channel A by the result.
    """
    global param_queue_a, last_time_a, cur_time_a
    cur_time_a = time.time()
    # print("A: [{0}] ~ {1}".format(addr, dis))

    if dis < 0.1:
        loop = asyncio.get_event_loop()
        asyncio.ensure_future(ci.set_pwm(1, -1), loop=loop)
        return
    if cur_time_a - last_time_a > settings.window_size:
        last_time_a = time.time()
        if len(param_queue_a) == 0 or not settings.can_update_power:
            param_queue_a.append(dis)
            return
        s = get_avg(param_queue_a)
        loop = asyncio.get_event_loop()
        if s < 0.1:
            asyncio.ensure_future(ci.set_pwm(1, -1), loop=loop)
        else:
            asyncio.ensure_future(
                ci.set_pwm(int(settings.coyote_max_power_a * s), -1), loop=loop
            )
        param_queue_a = []
    else:
        param_queue_a.append(dis)


def coyote_handler_b(addr, args, dis):
    """
    This function will calculate the avarage value of values from OSC
    within 1 second, and then set the power of the channel B by the result.
    """
    global param_queue_b, last_time_b, cur_time_b
    cur_time_b = time.time()
    # print("B: [{0}] ~ {1}".format(addr, dis))

    if dis < 0.1:
        loop = asyncio.get_event_loop()
        asyncio.ensure_future(ci.set_pwm(-1, 1), loop=loop)
        return
    if cur_time_b - last_time_b > settings.window_size:
        last_time_b = time.time()
        if len(param_queue_b) == 0 or not settings.can_update_power:
            param_queue_b.append(dis)
            return
        s = get_avg(param_queue_b)
        loop = asyncio.get_event_loop()
        if s < 0.1:
            asyncio.ensure_future(ci.set_pwm(-1, 1), loop=loop)
        else:
            asyncio.ensure_future(
                ci.set_pwm(-1, int(settings.coyote_max_power_b * s)), loop=loop
            )
        param_queue_b = []
    else:
        param_queue_b.append(dis)


async def main():
    await asyncio.gather(start_channel_a(), start_channel_b(), serve_osc())
    # await ci.stop()
    # await ci.disconnect()


class StartRequest(BaseModel):
    uid: str


@router.post("/start")
async def start_coyote(req: StartRequest, background_tasks: BackgroundTasks):
    global ci
    if ci is not None and ci.is_connected:
        return {"msg": "already started"}
    settings.coyote_uid = req.uid
    settings.dump()
    ci = CoyoteInterface(
        device_uid=settings.coyote_uid, power_multiplier=1.28, safe_mode=True
    )
    if ci.device is None:
        await ci.search_for_device()
    await ci.connect(retries=10)
    background_tasks.add_task(main)
    return {"msg": "starting"}


@router.get("/stop")
async def stop_coyote():
    if not ci.is_connected:
        return {"msg": "not started"}
    await ci.stop()
    await ci.disconnect()
    transport.close()
    return {"msg": "stopping"}


class UpdatePowerRequest(BaseModel):
    pow_a: int
    pow_b: int


@router.post("/max_power")
async def update_max_power(req: UpdatePowerRequest):
    """
    Set the max_power of the channel A and B.
    """
    try:
        if settings.coyote_max_power_a != 0:
            percentage_a = ci.pow_a / settings.coyote_max_power_a
        else:
            percentage_a = 0.5
        if settings.coyote_max_power_b != 0:
            percentage_b = ci.pow_b / settings.coyote_max_power_b
        else:
            percentage_b = 0.5
        settings.coyote_max_power_a = req.pow_a
        settings.coyote_max_power_b = req.pow_b
        await ci.set_pwm(int(percentage_a * req.pow_a), int(percentage_b * req.pow_b))
        settings.dump()
        return {"msg": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/max_power")
async def get_max_power():
    """
    Get the max_power of the channel A and B.
    """
    try:
        return {
            "pow_a": settings.coyote_max_power_a,
            "pow_b": settings.coyote_max_power_b,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


class UpdateOscAddrRequest(BaseModel):
    addr_a: str
    addr_b: str


@router.post("/osc_addr")
async def update_osc_addr(req: UpdateOscAddrRequest):
    """
    Set the osc param address of the channel A and B.
    """
    if ci.is_connected:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please stop the device first.",
        )
    try:
        settings.coyote_addr_a = req.addr_a
        settings.coyote_addr_b = req.addr_b
        settings.dump()
        return {"msg": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/osc_addr")
async def get_osc_addr():
    """
    Get the osc param address of the channel A and B.
    """
    try:
        return {
            "addr_a": settings.coyote_addr_a,
            "addr_b": settings.coyote_addr_b,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/patterns")
async def get_patterns():
    """
    Get the patterns list in `ci.patterns`.
    """
    try:
        return {
            "patterns": list(ci.patterns.keys()),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


class UpdatePatternRequest(BaseModel):
    pattern_a: str
    pattern_b: str


@router.post("/pattern")
async def update_pattern(req: UpdatePatternRequest):
    """
    Set the pattern of the device.
    """
    try:
        if req.pattern_a in ci.patterns.keys():
            settings.coyote_pattern_a = req.pattern_a
            ci.pattern_name_a = req.pattern_a
        if req.pattern_b in ci.patterns.keys():
            settings.coyote_pattern_b = req.pattern_b
            ci.pattern_name_b = req.pattern_b
        ci.switch_pattern = True
        settings.dump()
        return {"msg": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/pattern")
async def get_pattern() -> UpdatePatternRequest:
    """
    Get the pattern of the device.
    """
    try:
        return {
            "pattern_a": settings.coyote_pattern_a,
            "pattern_b": settings.coyote_pattern_b,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/status")
async def get_status():
    """
    Get the status of the device.
    """
    try:
        if ci and ci.is_connected:
            return {
                "is_connected": ci.is_connected,
                "battery_level": await ci.get_bettery_level(),
                "uid": settings.coyote_uid,
            }
        else:
            return {
                "is_connected": False,
                "battery_level": 0,
                "uid": "",
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/uid")
async def get_uid():
    """
    Get the uid of the device.
    """
    try:
        return {
            "uid": settings.coyote_uid,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# if __name__ == "__main__":
#     logging.basicConfig(level=logging.INFO)
#     asyncio.run(main())
