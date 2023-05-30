# OSC-Toys

[中文](https://github.com/Sakura0721/osc-toys/blob/master/README_ZH.md)

This project integrates bluetooth toys to VRChat avatars using OSC.

## Supported Toys

- DG-Lab E-Stim

## Supported Games

- VRChat (you must have an avatar supporting OSC with suitable avatar parameters)

## How does it work?

This program will communicate with VRChat using [OSC](https://docs.vrchat.com/docs/osc-overview).

It will listen to some values from VRC, and change the strength of toys.

For example, with this program, you can implement effects like when someone touch ears of your avatar, you will get shocked.

## Setup and Installation

- Clone this repo and install dependences.

```bash
git clone https://github.com/Sakura0721/osc-toys.git
cd osc-toy
pip install -r requirements.txt
```

- Edit settings.py, fill in necessary fields.
  - `COYOTE_UID`: If you don't know what it is, just set `COYOTE_UID = None`, the program will try to detact your device automatically.
  - `COYOTE_SAFE_MODE`: Enable or disable safe mode. This caps the max e-stim output of the device. Warning: Don't touch unless you know what you're doing!
  - `COYOTE_MAX_POWER_A` and `COYOTE_MAX_POWER_B`: Output power of Coyote when the value from VSC equals to `1.0`.
  - `COYOTE_PATTERN`: Output pattern of Coyote. See `data\estim\pattern_dict.json`.
  - `COYOTE_ADDR_A` and `COYOTE_ADDR_B`: OSC address bind to channel A/B.
  - `VRC_HOST` and `VRC_OSC_PORT`: OSC ip address and port of VRC. If you have no idea what it is, leave it as default.
- Find an avatar supports [OSC](https://docs.vrchat.com/docs/osc-overview) parameters, such as avatars enabled [VRCContactReceiver](https://docs.vrchat.com/docs/contacts#vrccontactreceiver).
  - Note that the parameters should be `float`. I.e. [Proximity](https://docs.vrchat.com/docs/contacts#receiver) reveiver type.
  - If you don't know what it is, find a modeler/avatar-creater to help you.
- Start VRC, and then run `main.py`. Enjoy it with your partner!

```bash
python main.py
```

## Changing Patterns

TBD: Better documentation here.

E-stim patterns are listed under the `data/estim/pattern_dict.json` file, and the `data/estim/patterns/` folder.

## FAQ
- The program can't connect to Coyote. / The program disconnects from Coyote sometimes.
  - If the program faild to connect to Coyote, try re-run it or re-run it after reboot bluetooth of your computer. Notices that you should run the program when the light of Coyote is NOT `white`. If the light is `white`, it means the device is in pairing mode, and the program can't connect to it.
  - The connection quality issue is caused by many reasons, such as the device is too far from your computer, or there are too many bluetooth devices around you. Try to move your device closer to your computer, or move your computer to a place with less bluetooth devices.
- The change of strength is not smooth or with latency.
  - As tested, the program works fine when `WINDOW_SIZE = 0.1`, i.e. the program will update the strength of toys every 0.1 seconds. If you want to make the change smoother, you can try to decrease the value of `WINDOW_SIZE`. But when the value is too small, the Coyote device may not be able to handle it (too many power update request), and the change will be delayed. So you should find a balance.

## Todos

- [ ] Add more toys.
  - If you have any toys want to be supported, welcome to open an issue or a PR.
- [ ] Support GUI.
  - Considering to add a web GUI to control the program.
- [ ] Change the implementation of communication with Coyote.
  - Some of the problems currently encountered (connection, and update delays) may be related to python's bluetooth library and async implementation. Not sure if switching to another implementation will improve, it may take some experimenting.
## Acknowledgements

- Code of communication with Coyote is based on [GIFT](https://github.com/MinLL/GameInterfaceForToys). Thanks to [@MinLL](https://www.github.com/MinLL) and [@inertaert](https://github.com/inertaert).
