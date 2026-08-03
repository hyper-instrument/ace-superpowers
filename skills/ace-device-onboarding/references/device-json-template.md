# Device Definition — Current Single-Backend Patterns

`device.json` supports both standalone devices and family-backed implementations.
In both forms, one concrete device has exactly one backend.

## Standalone device (no family)

Omit `type_ref`. The device must declare at least one capability and should provide
its capability schemas and parameters locally:

```json
{
  "name": "<device-id>",
  "type": "<DEVICE_TYPE>",
  "vendor": "<Vendor Name>",
  "model": "<Model Name>",
  "version": "1.0.0",
  "description": "Brief description of the concrete device",
  "capabilities": [
    "capability_1",
    "capability_2",
    "capability_3"
  ],
  "capability_schemas": {
    "capability_1": {
      "inputs": {
        "value": {
          "type": "number",
          "description": "Input value and unit"
        }
      },
      "outputs": {
        "success": {
          "type": "boolean"
        }
      }
    },
    "capability_2": {
      "inputs": {
        "mode": {
          "type": "string",
          "enum": ["mode_a", "mode_b"]
        }
      },
      "outputs": {
        "result": {
          "type": "object"
        }
      }
    },
    "capability_3": {
      "inputs": {},
      "outputs": {
        "state": {
          "type": "object"
        }
      }
    }
  },
  "parameters": {
    "param_group_1": {
      "range": ["<min>", "<max>"],
      "presets": ["preset1", "preset2"]
    },
    "param_group_2": {
      "options": ["option1", "option2"]
    }
  },
  "has_simulator": false,
  "device_backend": {
    "source": "local",
    "config": {}
  },
  "metadata": {
    "sdk_install": {
      "method": "pip",
      "package": "git+ssh://git@github.com/org/sdk.git@<commit>",
      "import_name": ["sdk_top_level_module"]
    }
  }
}
```

## Family-backed implementation

Set `type_ref` to the directory containing `type.json`. The leaf inherits family
capabilities and parameters. Its own `capabilities`, `capability_schemas`, and
`parameters` are optional; include them only for leaf-specific additions or overrides:

```json
{
  "name": "<device-family>/<implementation>",
  "type": "<DEVICE_TYPE>",
  "type_ref": "<device-family>",
  "vendor": "<Vendor Name>",
  "model": "<Model Name>",
  "version": "1.0.0",
  "description": "Brief description of this family implementation",
  "capabilities": [
    "implementation_specific_capability"
  ],
  "capability_schemas": {
    "implementation_specific_capability": {
      "inputs": {
        "mode": {
          "type": "string",
          "enum": ["mode_a", "mode_b"]
        }
      },
      "outputs": {
        "result": {
          "type": "object"
        }
      }
    }
  },
  "parameters": {
    "param_group_1": {
      "range": ["<implementation-min>", "<implementation-max>"],
      "presets": ["implementation-preset"]
    }
  },
  "has_simulator": false,
  "device_backend": {
    "source": "local",
    "config": {}
  },
  "metadata": {
    "sdk_install": {
      "method": "pip",
      "package": "git+ssh://git@github.com/org/sdk.git@<commit>",
      "import_name": ["sdk_top_level_module"]
    }
  }
}
```

For a project-local SDK, use a plain path relative to the **project root**:

```json
"sdk_install": {
  "method": "local",
  "package": "path/to/sdk",
  "import_name": ["sdk_top_level_module"]
}
```

The local path goes in `package` — `path` is only valid inside an `extra_packages[]` entry
and is rejected at the top level. Avoid `${ACE_PROJECT_ROOT}/...`: that variable is unset
outside the CLI wrapper, and an unexpanded `${...}` is a hard error rather than a guess.

For a shared wheel, use OSS with an immutable object key and checksum:

```json
"sdk_install": {
  "method": "oss",
  "key": "vendor/dist/sdk-1.2.3-py3-none-any.whl",
  "sha256": "<wheel-sha256>",
  "import_name": ["sdk_top_level_module"]
}
```

`type_ref` is optional. When present, it requires
`devices/<device-family>/type.json`; when absent, the standalone device owns its
complete capability contract.

Key principles:

- A concrete device has exactly one `device_backend`.
- `type_ref`, `capability_schemas`, `parameters`, and family-backed leaf
  `capabilities` are optional. Standalone devices must declare non-empty
  `capabilities`.
- `has_simulator` describes whether this leaf is simulated; keep the safe template
  default `false` for physical devices and set it to `true` only for simulator leaves.
- Ordinary SDK operations live in `device.py`; `node.py` is optional custom logic.
- `metadata.sdk_install` may be omitted **only** for a genuinely self-contained backend
  (logic embedded in `device.py`, nothing imported beyond the stdlib and `ace` — see
  `computer/simulator`). The moment `device.py` imports an SDK, declare it: `method: "local"`
  with a project-root-relative `package` for a local SDK, `method: "oss"` with object `key` +
  SHA256 for a shared wheel, `method: "pip"` for a package/Git URL. Always include
  `import_name` — it is how ACE decides whether the SDK is already installed.
- `device.py` must never touch `sys.path` or derive a root from `ACE_ROOT` / counted
  `.parent` levels. Import ACE from `ace.core.*` and the SDK from its `import_name`.
- Prefer the neutral `device_backend` key over the deprecated bare `simulator` key, and
  `metadata.sdk_install` over `metadata.sdk` / `metadata.sdk_path`. `simulator_id` and
  `has_simulator` are valid simulator fields (see `computer/simulator`), not errors.
