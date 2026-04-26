# Device Definition — Standard Pattern

**`device.json`** — Thin capability contract, NOT implementation:

```json
{
  "name": "<device-type>/<implementation>",
  "type": "<DEVICE_TYPE>",
  "vendor": "<Vendor Name>",
  "model": "<Model Name>",
  "version": "1.0.0",
  "description": "Brief description of the device",
  "capabilities": [
    "capability_1",
    "capability_2",
    "capability_3"
  ],
  "parameters": {
    "param_group_1": {
      "range": [min, max],
      "presets": ["preset1", "preset2"]
    },
    "param_group_2": {
      "options": ["option1", "option2"]
    }
  },
  "connection": {
    "protocol": "tcp|serial|rest|...",
    "host": "127.0.0.1",
    "port": 50000,
    "authkey": "optional_auth_key"
  },
  "has_simulator": true,
  "simulator_id": "<device-id>-simulator",
  "simulator": {
    "source": "local",
    "simulator_id": "<device-id>-simulator",
    "speed_multiplier": 10.0
  },
  "metadata": {
    "simulator_class": "<DeviceName>Simulator",
    "sdk_install": {
      "method": "pip|local",
      "package": "git+ssh://... OR /local/path/to/sdk"
    }
  }
}
```

**Key Principles:**
- `device.json` is a **capability declaration**, not implementation code
- Implementation details go in **nodes**, referenced by capabilities
- SDK configuration in `metadata.sdk_install` (pip URL or local path)
- Simulator class name in `metadata.simulator_class` (matches device.py)
