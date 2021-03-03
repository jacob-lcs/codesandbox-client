import React, { FunctionComponent, useEffect, useState } from 'react';

import { Element, Button, Stack } from '@codesandbox/components';
import { useAppState, useEffects, useActions } from 'app/overmind';
import css from '@styled-system/css';
import { Item } from './elements';
import { Alert } from '../Common/Alert';

export const GithubPagesLogs: FunctionComponent = () => {
  const effects = useEffects();
  const { modalClosed } = useActions();
  const { currentSandbox } = useAppState().editor;
  const [logs, setLogs] = useState(['Waiting for build to start']);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { logs: fetchedLogs, status } = await effects.githubPages.getLogs(
        currentSandbox.id
      );

      if (fetchedLogs.length > 0) {
        setLogs(fetchedLogs);
      }

      if (status === 'DONE') {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Alert
      title="Sandbox Site Logs"
      description="Builds typically take a minute or two to complete"
    >
      <Element
        marginY={6}
        padding={4}
        css={css({
          fontFamily: "'MonoLisa'",
          maxHeight: 400,
          overflow: 'auto',
          wordBreak: 'break-word',
          borderRadius: 'medium',
          border: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        {logs.map(log => (
          <Item marginBottom={2} key={log}>
            {log}
          </Item>
        ))}
      </Element>
      <Stack gap={2} align="center" justify="flex-end">
        <Button
          css={css({
            width: 'auto',
          })}
          variant="link"
          onClick={modalClosed}
        >
          Close
        </Button>
      </Stack>
    </Alert>
  );
};
