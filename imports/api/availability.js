import { Mongo } from 'meteor/mongo';

export const Avaliability = new Mongo.Collection( 'availability' );

Avaliability.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Avaliability.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
