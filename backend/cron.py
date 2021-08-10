import asyncio
import core.runner as runner
from datetime import datetime

async def main():
        date = datetime.today()
        output = await runner.execute(date=date, dry_run=True)
        print(output)
asyncio.run(main())