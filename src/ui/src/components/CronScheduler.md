### CronScheduler examples

Cron editor:

```jsx

function onChange(cronString) {
  console.log(cronString);
}

<CronScheduler onChange={onChange} />

```

Cron editor with preset cron schedule:

```jsx

<CronScheduler value="0 10 8 21 9 ?"/>
<CronScheduler value="0 0 * * * ?" />
<CronScheduler value="0 10 8 * * ?" />
<CronScheduler value="0 10 8 ? * 2-6" />
<CronScheduler value="0 10 8 ? * 1" />
<CronScheduler value="0 10 8 21 * ?" />

```
