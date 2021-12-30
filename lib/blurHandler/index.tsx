import { sectionImages } from '../../components/Images';
import { getPlaiceholder } from 'plaiceholder';
import {
  IBlurOutput,
  IObjectWithUrlProps,
  ISection,
  SectionKeys,
  IUrlProps,
} from '../../components/Images/types';

/**
 * Handles Sections with requires an Image Array
 *
 * @param section
 * @returns
 */
const sectionArrayHandler = async (section: IUrlProps[]) => {
  const sectionList = [] as any;
  await Promise.all(
    section.map(async (image) => {
      const url = image.url;
      const { base64 } = await getPlaiceholder(url, { size: 10 });

      sectionList.push({ ...image, base64 });
    })
  );
  return sectionList;
};

/**
 * Handles Sections with requires an Image Object
 *
 * @param section
 */
const sectionObjectHandler = async (section: ISection) => {
  const sectionList = {} as any;
  const sectionBla = section as IObjectWithUrlProps;
  const sectionKeys = Object.keys(sectionBla);
  await Promise.all(
    sectionKeys.map(async (key) => {
      const url = sectionBla[key].url;
      const { base64 } = await getPlaiceholder(url, { size: 10 });

      sectionList[key] = {
        ...sectionBla[key],
        base64,
      };
    })
  );
  return sectionList;
};

/**
 * Checks for Object Type and gets corrent base64 object or array
 *
 * @param section
 * @returns
 */
const sectionHandler = async (section: ISection) => {
  if (section.constructor === Array) return await sectionArrayHandler(section);
  return await sectionObjectHandler(section);
};

/**
 * Creates Props
 *
 * @returns IBlurOutput
 */
export const blurHandler = async (): Promise<IBlurOutput> => {
  const imageList = {} as any;

  const sectionKeys = Object.keys(sectionImages) as SectionKeys;

  await Promise.all(
    sectionKeys.map(async (key) => {
      const sectionList = await sectionHandler(sectionImages[key]);

      imageList[key] = sectionList;
    })
  );

  return imageList;
};
