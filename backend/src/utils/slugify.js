const slugifyLib = require('slugify');

const makeUniqueSlug = async (Model, title, suffix = '') => {
  const slugBase = slugifyLib(title + (suffix ? `-${suffix}` : ''), { lower: true, strict: true });
  const exists = await Model.findOne({ slug: slugBase });
  if (!exists) return slugBase;
  // generate random small suffix
  const newSuffix = Math.floor(Math.random() * 10000);
  return makeUniqueSlug(Model, title, newSuffix);
}

module.exports = makeUniqueSlug;
