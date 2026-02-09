import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from '@iconify/tools';
import { getIconCSS } from '@iconify/utils';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourcePath = '../svgs';
const destPath = '../icon.css';
const ignoreIconNames = ['i18n-en', 'i18n-zh', 'add-file', 'upload-file'];

export function getDirname() {
  const filename = fileURLToPath(import.meta.url);
  return dirname(filename);
}

export async function genCSS() {
  const iconSet = await importDirectory(join(getDirname(), sourcePath), {
    prefix: 'zs',
    ignoreImportErrors: false,
  });

  let cssStr = '';
  iconSet.forEach((name, type) => {
    if (type !== 'icon') return;

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    if (!ignoreIconNames.includes(name)) {
      try {
        cleanupSVG(svg);
        parseColors(svg, {
          defaultColor: 'currentColor',
          callback: (attr, colorStr, color) => {
            if (!color) {
              return colorStr;
            }

            if (isEmptyColor(color)) {
              return color;
            }
            return 'currentColor';
          },
        });

        runSVGO(svg);
      } catch (err) {
        // Invalid icon
        console.error(`ICON Error parsing ${name}:`, err);
        iconSet.remove(name);
      }
    }

    const iconData = svg.getIcon();
    cssStr +=
      getIconCSS(iconData, {
        iconSelector: '.zs-icon__' + name,
      }) + '\n';
  });

  return writeFile(join(getDirname(), destPath), cssStr, 'utf8');
}
