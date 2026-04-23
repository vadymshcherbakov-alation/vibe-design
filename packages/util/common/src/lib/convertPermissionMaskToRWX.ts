import {each} from 'lodash';

export function convertPermissionMaskToRWX(bits: number, isDirectory: boolean) {
  const rwxMap: {[key: string]: string} = {
    0: '---',
    1: '--x',
    2: '-w-',
    3: '-wx',
    4: 'r--',
    5: 'r-x',
    6: 'rw-',
    7: 'rwx',
  };
  let mask = isDirectory ? 'd' : '-';
  const bitString = bits.toString();
  const len = bitString.length;
  const permissionBits = len > 3 ? bitString.substring(1, len) : bitString;
  each(permissionBits, function (digit) {
    mask += rwxMap[digit];
  });
  if (len === 4 && bitString.charAt(0) === '1') {
    const perm = mask;
    mask = mask.substring(0, mask.length - 1);
    mask += perm.endsWith('x') ? 't' : 'T';
  }
  return mask;
}
