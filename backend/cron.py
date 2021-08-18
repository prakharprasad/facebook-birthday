import asyncio
from types import coroutine
import click
import core.runner as runner
from datetime import datetime
from random import randint
from time import sleep
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
    # Wait between 10 to 25 minutes before executing the runner for actual runs
    sleep_duration = randint(10, 25)
    print(f"[+] Sleeping for {sleep_duration} minutes")
    if dry_run:
        print("[+] Dry Run")
        output = await runner.execute(date=date, dry_run=True)
    else:
        sleep(sleep_duration * 60)
        print("[+] Normal Run")
        output = await runner.execute(date=date, dry_run=False)

    print(output)
if __name__ == '__main__':
    main()
