import { Asserts, mixed, number, array, object, string } from 'yup';
import { ExtraProductCategories, ProductCategories } from 'components/pages/explore/form';

export const createSchema = object({
  file: mixed().required(),
  // onsale: boolean(),
  // instantsale: boolean(),
  // instantsaleprice: number()
  //   .notRequired()
  //   .when('instantsale', (instantsale: boolean, schema: NumberSchema) => {
  //     return instantsale ? schema.required('Please input sale price.') : schema;
  //   }),
  instantsaleprice: number().typeError('Please input sale price.').required('Please input sale price.'),
  unit: string().required(),
  // unlockonbuy: boolean(),
  // lockedcontent: string(),
  // collection: string().required('Please choose collection.'),
  name: string().required('Please enter product name.'),
  description: string(),
  // royalties: number().typeError('Please enter royalties.').required('Please enter royalties.'),
  // properties: string().notRequired(),
  categories: array(
    object().shape({
      name: string().required(),
      id: number().required(),
    })
  ).min(1, 'Please select at least 1 category.'),
});

export type CreateForm = Asserts<typeof createSchema>;

export const Unit = ['BMP', 'BUSD', 'BNB'];

export const Categories = [...ProductCategories, ...ExtraProductCategories].map((category, idx) => {
  return { id: idx, name: category };
});

export const initialValue: CreateForm = {
  // onsale: true,
  name: '',
  file: undefined,
  // collection: '',
  description: '',
  // instantsale: true,
  instantsaleprice: 0,
  unit: Unit[0],
  // lockedcontent: '',
  // unlockonbuy: false,
  // royalties: 0,
  // properties: undefined,
  categories: [],
};
