# Troubleshooting 🆘

## Running FMTM standalone

- Although it's easiest to use Docker, sometimes it may no be feasible, or not preferred.
- We use a tool called PDM to manage dependencies.
- PDM can run in two modes: venv and PEP582 (`__pypackages__`).
- Be careful when running FMTM you are not accidentally pulling in your system packages.

Tips:

- If a directory `__pypackages__` exists, delete it and attempt to
  `pdm install`
  again.
- If the `__pypackages__` directory returns, then force using venv instead
  `pdm config python.use_venv true`
  and remove the directory again.
- Troubleshoot the packages PDM sees with:
  `pdm run pip list`
- Check a package can be imported in the PDM-based Python environment:

```bash
pdm run python
import fastapi
```
