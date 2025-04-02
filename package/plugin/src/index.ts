import type { IApi } from 'umi';
import path from 'path';

export default (api: IApi) => {
  // See https://umijs.org/docs/guides/plugins
  const config = api.userConfig;

  api.describe({
    key: 'keepaliveTabs',
    config: {
      schema(joi) {
        return joi.string().required();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });

  api.addRuntimePluginKey(() => 'keepaliveTabs');

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      content: `export const add = (num1: number, num2: number): number => num1 + num2`,
      path: 'index.tsx',
    })
    api.writeTmpFile({
      content: `import React, { useEffect } from 'react';
      import { ApplyPluginsType } from 'umi';
      import { getPluginManager } from '../core/plugin';
      
      function Layout(props) {
      
        async function getRuntime() {
          const config = await getPluginManager().applyPlugins({
            key: 'keepaliveTabs',
            type: ApplyPluginsType.modify,
            initialValue: '',
            async: true,
          });
          setTimeout(() => {
          document.title = config || "${api.userConfig.keepaliveTabs}";
          }, 1000);
        }
      
        useEffect(() => {
          getRuntime();
        }, [])
      
        return (
          <div>{props.children}</div>
        )
      }
      export function rootContainer(container) {
        return React.createElement(Layout, null, container);
      }      
      `,
      path: 'runtime.tsx',
    });
  })

  api.addRuntimePlugin(() => path.join(api.paths.absTmpPath!, `plugin-keepaliveTabs/runtime.tsx`),)

  console.log(config.keepaliveTabs);
};