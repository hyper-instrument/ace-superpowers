---
description: "ACE Paradigm 2: Onboard devices with evolution闭环 (inspired by superpowers philosophy)"
---

# ACE Paradigm 2 - Device & Simulator Onboarding

Transform device manuals and SDKs into ACE-orchestratable assets.
Inspired by superpowers philosophy: clarify → design (2-3 options) → verify → evolve.

## When to Use

- User brings new instrument/device manuals
- User provides SDK/API with examples
- Need to create Device + Simulator definitions
- No existing abstraction for target device (check `ace hub list --type devices` first)

## Before Onboarding: Check ace-hub

**Always check ace-hub first before creating new device:**

1. **List available devices in hub:**
   ```bash
   ace hub list --type devices
   ```

2. **Pull existing device if available:**
   ```bash
   ace hub pull <device_id> --type device
   ```

3. **Only onboard if device doesn't exist in hub or locally**

## Workflow (Superpowers-Inspired + Evolution)

### Phase 1: Clarify (Superpowers Philosophy)

Ask one question at a time to understand:
1. What device/instrument?
2. What manuals/documentation available?
3. What SDK/API available?
4. What's the goal? (Full automation, HITL, or future capability?)
5. Any safety constraints or dangerous operations?

### Phase 2: Design

**Design the onboarding approach** (propose 2-3 options):

- **Option A**: Full simulator + automation
- **Option B**: HITL (Human-in-the-loop) with traces
- **Option C**: Hybrid (some operations simulated, some HITL)

Get user approval before proceeding.

### Phase 3: Knowledge Ingestion

1. **Manuals → Knowledge Base**
   - Use /ace-knowledge ingest for PDFs/docs
   - PageIndex for searchable chapters
   - Extract terminology, constraints, safety rules

2. **Knowledge validation**
   - Query ingested knowledge to verify extraction quality
   - Confirm key concepts captured

### Phase 4: Device + Simulator Implementation

1. **SDK Analysis**
   - Parse SDK surface
   - Map public APIs to operations
   - Identify state machine requirements

2. **Device Definition (device.json)**

   Create `~/.ace/store/devices/<device-type>/<implementation>/device.json`:

   **Simulator-only Device**:
   ```json
   {
     "name": "xxx/simulator",
     "type": "XXX",
     "vendor": "Vendor",
     "model": "Model",
     "description": "XXX simulator",
     "capabilities": ["op1", "op2"],
     "parameters": {
       "param1": {"type": "number", "default": 1.0}
     },
     "has_simulator": true,
     "simulator_id": "xxx-simulator",
     "simulator": {
       "source": "local",
       "config": {
         "simulator_id": "xxx-simulator",
         "speed_multiplier": 10.0
       }
     },
     "metadata": {
       "simulator_class": "XXXSimulator",
       "sdk_install": {
         "method": "pip",
         "package": "git+ssh://git@github.com/user/repo.git"
       }
     }
   }
   ```

   **Device with Hardware Backend + Simulator**:
   ```json
   {
     "name": "xxx/vendor",
     "type": "XXX",
     "vendor": "Vendor",
     "model": "Model",
     "description": "XXX instrument",
     "capabilities": ["op1", "op2"],
     "parameters": {
       "param1": {"type": "number", "default": 1.0}
     },
     "has_simulator": true,
     "simulator_id": "xxx-simulator",
     "backend": {
       "source": "local",
       "config": {
         "host": "127.0.0.1",
         "port": 8080,
         "timeout": 10.0
       }
     },
     "simulator": {
       "source": "local",
       "config": {
         "simulator_id": "xxx-simulator",
         "speed_multiplier": 10.0
       }
     },
     "metadata": {
       "sdk": "package-name"
     }
   }
   ```

   **Key Fields**:
   - `source: "local"` - Loads implementation from local device.py
   - `config` - Passed to device class constructor
   - `metadata.sdk_install.package` - Git URL for SDK installation
   - `metadata.sdk` - PyPI package name (alternative to sdk_install)

3. **Device Implementation (device.py)**

   Create `~/.ace/store/devices/<device-type>/<implementation>/device.py` following the standard paradigm:

   **Simulator Device** (`simulator/device.py`):
   ```python
   """XXX Simulator Implementation"""
   import asyncio
   import logging
   from typing import Any, Dict

   import sys
   import os
   from pathlib import Path
   ace_root = os.environ.get("ACE_ROOT", str(Path(__file__).parent.parent.parent.parent.parent.parent.parent))
   sys.path.insert(0, str(ace_root))

   from src.core.simulator.base import SimulatorDevice, OperationResult

   logger = logging.getLogger(__name__)


   class XXXSimulator(SimulatorDevice):
       """XXX Simulator"""

       @property
       def vendor(self) -> str:
           return "Vendor"

       @property
       def model(self) -> str:
           return "Model"

       @property
       def capabilities(self) -> list:
           return ["op1", "op2"]

       async def execute_operation(self, operation: str, params: Dict[str, Any]) -> OperationResult:
           """Execute device operation"""
           handler = getattr(self, f"_op_{operation}", None)
           if handler is None:
               return OperationResult(success=False, error=f"Unknown operation: {operation}")

           try:
               result = await handler(params)
               return OperationResult(success=True, output=result)
           except Exception as e:
               logger.exception("Operation failed: %s", operation)
               return OperationResult(success=False, error=str(e))

       async def _op_example(self, params: Dict[str, Any]) -> Dict[str, Any]:
           """Example operation handler"""
           return {"result": "success"}
   ```

   **Hardware Device Backend** (`<vendor>/device.py`):
   ```python
   """XXX Device Backend"""
   import asyncio
   import logging
   from typing import Any, Dict, Optional

   import sys
   import os
   from pathlib import Path
   ace_root = os.environ.get("ACE_ROOT", str(Path(__file__).parent.parent.parent.parent.parent.parent.parent))
   sys.path.insert(0, str(ace_root))

   from src.core.devices.backend import BaseDeviceBackend

   logger = logging.getLogger(__name__)


   class XXXDevice(BaseDeviceBackend):
       """XXX Hardware Backend"""

       def __init__(self, device_info: Any, host: str = "127.0.0.1", port: int = 8080, timeout: float = 10.0):
           super().__init__(device_info)
           self.host = host
           self.port = port
           self.timeout = timeout
           self._connected = False

       async def connect(self) -> bool:
           """Connect to hardware"""
           try:
               # Implementation
               self._connected = True
               return True
           except Exception as e:
               logger.error("Failed to connect: %s", e)
               return False

       def disconnect(self) -> None:
           """Disconnect from hardware"""
           self._connected = False

       def is_connected(self) -> bool:
           return self._connected

       async def execute_operation(self, operation: str, params: Dict[str, Any]) -> Dict[str, Any]:
           """Execute device operation"""
           if not self._connected:
               ok = await self.connect()
               if not ok:
                   return {"success": False, "error": "Not connected"}

           handler = getattr(self, f"_op_{operation}", None)
           if handler is None:
               return {"success": False, "error": f"Unknown operation: {operation}"}

           try:
               return await handler(params)
           except Exception as e:
               logger.exception("Operation failed: %s", operation)
               return {"success": False, "error": str(e)}

       async def _op_example(self, params: Dict[str, Any]) -> Dict[str, Any]:
           """Example operation handler"""
           return {"success": True, "result": "success"}
   ```

4. **SKILL.md Creation**
   - Document capabilities
   - List dangerous operations
   - Map simulator operations to manual procedures
   - Document HITL points (if no simulator)

5. **Verification**
   - Test device definition validates
   - Test simulator runs (if implemented)
   - Check type safety

### Phase 5: Distill Operations

1. **Derive atomic operations**
   - From manual steps and SDK surface
   - Each operation should be deterministic
   - Clear input/output ports

2. **Create initial nodes**
   - One node per atomic operation
   - Validate with type checker
   - Test in simulator

3. **Register everything**
   - Device to ~/.ace/store/devices/
   - Nodes to ~/.ace/store/nodes/
   - Update registry.jsonl

### Phase 6: Evolution闭环

1. **Trace accumulation** (L1)
   - Onboarding process itself is traced
   - SDK mapping decisions → traces
   - Manual alignment decisions → traces

2. **Pattern extraction** (L2)
   - Run /ace-evolve on device onboarding traces
   - Extract patterns:
     - "Common SDK mapping patterns"
     - "Manual → code translation patterns"
     - "Safety constraint patterns"

3. **Knowledge solidification**
   - Create insights for reusable patterns
   - Update fitness based on subsequent usage
   - Promote to CLAUDE.md if universal

## Key Principles (Superpowers + ACE)

**From Superpowers:**
- Clarify before building (one question at a time)
- Design alternatives (propose 2-3 approaches)
- Verify at each milestone (manual ingest OK? simulator runs?)
- No speculative work (only build what user confirms)

**From ACE:**
- Accumulate: Onboarding process → traces
- Composable: Device + Simulator + Nodes work together
- Evolve: Device onboarding patterns feed future onboardings

## Deliverables

| Artifact | Location | Purpose |
|----------|----------|---------|
| Device definition | ~/.ace/store/devices/<type>/<impl>/device.json | Capability contract |
| Device implementation | ~/.ace/store/devices/<type>/<impl>/device.py | Python implementation (follows standard paradigm) |
| SKILL.md | ~/.ace/store/devices/<type>/<impl>/SKILL.md | Operation catalog |
| Knowledge entries | ~/.ace/knowledge/ | Searchable manual content |
| Initial nodes | ~/.ace/store/nodes/atomic/<device>_*/ | Reusable operations |
| Traces | ~/.ace/traces/ | Onboarding process record |
| Insights | ~/.ace/insights/device-<id>*.md | Patterns for future |

## Interaction Flow Example

**User**: "I need to onboard a new TEM instrument."

**Agent**: "I'll help you onboard the TEM. Let me start by clarifying a few things...

1. What specific TEM model are you working with?"

**User**: "It's a JEOL JEM-ARM200F."

**Agent**: "Got it. What manuals or documentation do you have available? (PDFs, API docs, etc.)"

**User**: "I have the user manual PDF and a Python SDK from JEOL."

**Agent**: "Great. What's your goal - full automation, human-in-the-loop, or building future capability?"

**User**: "We want to automate sample screening workflows."

**Agent**: "Any safety constraints or dangerous operations I should know about?"

**User**: "High voltage operations and beam alignment need careful handling."

**Agent**: "Understood. Based on this, I propose 3 onboarding approaches:

**Option A**: Full simulator + automation
- Build complete simulator from SDK
- Full workflow automation
- Best for: Well-understood, safe operations

**Option B**: HITL with traces
- Human executes, ACE learns
- Accumulate traces for future automation
- Best for: Complex, safety-critical operations

**Option C**: Hybrid
- Simulator for safe operations
- HITL for high-voltage/beam alignment
- Best for: Mixed safety requirements

Which approach fits your needs?"

**User**: "Option C - hybrid approach."

**Agent**: "Perfect. Starting with Option C - Hybrid approach.

**Phase 3: Knowledge Ingestion**

Let me ingest the TEM manual into the knowledge base..."

[Continues through phases...]

## Canonical Statements

- "Before onboarding, let me clarify the device and goals..."
- "Proposing 3 onboarding approaches (inspired by superpowers)..."
- "Ingesting manuals into knowledge base..."
- "Mapping SDK to Device + Simulator with verification at each step..."
- "Onboarding traces captured. Running evolution to extract patterns..."
- "Device onboarded. Patterns will improve future onboardings."
