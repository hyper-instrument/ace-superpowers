---
description: ACE Paradigm 2 - Onboard new devices and simulators
---
# ACE P2 - Device Onboarding

Transform device manuals and SDKs into ACE-orchestratable assets.
TDD required: Write test → Build node → Verify test passes → Validate with simple workflow

## Usage

This command invokes the `ace-device-onboarding` skill from ace-superpowers.

## ACE CLI Commands (Recommended)

### List Existing Devices
```bash
ace device list
```

### View Device Details
```bash
ace device info <device_id> [--skill]
```

### Create New Device
```bash
ace device create <name> <type> [--vendor <vendor>] [--model <model>]
```

### Validate Device Definition
```bash
ace device validate <device_id>
```

### List Simulators
```bash
ace simulator list
```

### Check Simulator Status
```bash
ace simulator status <simulator_id>
```

### Pull from ace-hub
```bash
ace hub pull [devices|workflows|nodes|all]
```

## Workflow

1. Clarify intent (one question at a time)
2. Design (propose 2-3 onboarding approaches)
3. Knowledge ingestion (manuals → knowledge base)
4. **Execute with TDD**
   - RED: Write failing test for node
   - GREEN: Build node to pass test
   - REFACTOR: Clean up while tests green
5. **Verify with two-layer validation**
   - Layer 1: Node unit tests
   - Layer 2: Simple workflow end-to-end test
6. Evolution闭环

## Invocation

```
Skill("ace-device-onboarding")
```
