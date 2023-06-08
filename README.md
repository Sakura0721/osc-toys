<div align="center" id="top">
  <img width="200" src="images/logo.svg" alt="OSC-Toys Logo" />
</div>

<h1 align="center">OSC-Toys</h1>

<p align="center">
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/Sakura0721/osc-toys/release-exe.yaml">

  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Sakura0721/osc-toys?style=social">

  <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/Sakura0721/osc-toys/total">

  <img alt="GitHub" src="https://img.shields.io/github/license/Sakura0721/osc-toys">

  <img alt="Discord" src="https://img.shields.io/discord/1091699221226328165">
</p>

## Introduction

[中文](https://github.com/Sakura0721/osc-toys/blob/master/README_ZH.md)

This project integrates bluetooth toys to VRChat avatars using OSC.

![page_overview](images/page_overview.png)

![page_coyote](images/page_coyote.png)

## Supported Toys

- DG-Lab E-Stim

## Supported Games

- VRChat (you must have an avatar supporting OSC with suitable avatar parameters)

## How does it work?

This program will communicate with VRChat using [OSC](https://docs.vrchat.com/docs/osc-overview).

It will listen to some values from VRC, and change the strength of toys.

For example, with this program, you can implement effects like when someone touch ears of your avatar, you will get shocked.

## Setup and Installation

### From release

- Download the latest release from [release page](https://github.com/Sakura0721/osc-toys/releases).
- unzip the file and run `osc-toys.exe`.
- Find an avatar supports [OSC](https://docs.vrchat.com/docs/osc-overview) parameters, such as avatars enabled [VRCContactReceiver](https://docs.vrchat.com/docs/contacts#vrccontactreceiver).
  - Note that the parameters should be `float`. I.e. [Proximity](https://docs.vrchat.com/docs/contacts#receiver) reveiver type.
  - If you don't know what it is, find a modeler/avatar-creater to help you.
- Start VRC, fill in necessary fields in WebUI and click `Connect and Start` button in `Coyote` page. Enjoy it with your partner!

### From source code

You can also run the program from source code on your own demand.

- Clone this repo and install dependences.

```bash
git clone https://github.com/Sakura0721/osc-toys.git
cd osc-toys
pip install -r requirements.txt
```

- Complie frontend:

```bash
cd frontend
npm install
npm run build
npm run export
```

- Run the program:

```bash
python main.py
```

### Settings

It's not recommended to change the default settings because the WebUI is enough for most users.

In case you want to change the settings, here are some fields you can change in `settings.yaml`:

- `coyote_uid`: If you don't know what it is, just set `coyote_uid: ""`, the program will try to detact your device automatically.
- `coyote_safe_mode`: Enable or disable safe mode. This caps the max e-stim output of the device. Warning: Don't touch unless you know what you're doing!
- `coyote_max_power_a` and `coyote_max_power_b`: Output power of Coyote when the value from VSC equals to `1.0`.
- `coyote_pattern_a` and `coyote_pattern_b`: Output pattern of Coyote. See `data\estim\pattern_dict.json`.
- `coyote_addr_a` and `coyote_addr_b`: OSC address bind to channel A/B.
- `vrc_host` and `vrc_osc_port`: OSC ip address and port of VRC. If you have no idea what it is, leave it as default.

## Changing Patterns

TBD: Better documentation here.

E-stim patterns are listed under the `data/estim/pattern_dict.json` file, and the `data/estim/patterns/` folder.

## FAQ

- The program can't connect to Coyote. / The program disconnects from Coyote sometimes.
  - If the program faild to connect to Coyote, try re-run it or re-run it after reboot bluetooth of your computer. Notices that you should run the program when the light of Coyote is NOT `white`. If the light is `white`, it means the device is in pairing mode, and the program can't connect to it.
  - The connection quality issue is caused by many reasons, such as the device is too far from your computer, or there are too many bluetooth devices around you. Try to move your device closer to your computer, or move your computer to a place with less bluetooth devices.
- The change of strength is not smooth or with latency.
  - As tested, the program works fine when `window_size = 0.1`, i.e. the program will update the strength of toys every 0.1 seconds. If you want to make the change smoother, you can try to decrease the value of `window_size`. But when the value is too small, the Coyote device may not be able to handle it (too many power update request), and the change will be delayed. So you should find a balance.

## Contact

[OSC-Toys Official Discord Server](https://discord.gg/5HRgXNzCBP)

## Todos

- [ ] Decouple the OSC server and the bluetooth communication.
  - Currently int the code, the OSC server and bluetooth device start and stop together. This is not a good design. The OSC server should be able to run without bluetooth device connected. Otherwise, adding more toys will be difficult.
- [ ] Add more toys.
  - If you have any toys want to be supported, welcome to open an issue or a PR.
- [x] Support GUI.
  - A WebUI has been added.
- [ ] Change the implementation of communication with Coyote.
  - Some of the problems currently encountered (connection, and update delays) may be related to python's bluetooth library and async implementation. Not sure if switching to another implementation will improve, it may take some experimenting.

## Acknowledgements

- Code of communication with Coyote is based on [GIFT](https://github.com/MinLL/GameInterfaceForToys). Thanks to [@MinLL](https://www.github.com/MinLL) and [@inertaert](https://github.com/inertaert).
