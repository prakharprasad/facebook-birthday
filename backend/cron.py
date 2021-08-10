import asyncio
from types import coroutine
import click
import core.runner as runner
from datetime import datetime
from functools import wraps

def coro(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))

    return wrapper

@click.command()
@click.option('--dry-run', '-d', default=True, help='Run this script in dry run mode.')
@coro
async def main(dry_run):
        date = datetime.today()
        output = None
        if dry_run:
            print("[+] Dry Run")
            output = await runner.execute(date=date, dry_run=True)
        else:
            print("[+] Normal Run")
            output = await runner.execute(date=date, dry_run=False)

        print(output)
if __name__ == '__main__':
    main()