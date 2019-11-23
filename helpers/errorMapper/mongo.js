const normalizeIndexName = (idxName) => idxName.replace(/(_1|_index)/, '');

module.exports = (err) => {
  const dupErrMsgRegEx = /collection:\s.+\.(?<collection>.+)\sindex:\s(?<index>.+)\sdup\skey:\s\{.*:\s(?<qoute>")?(?<value>.*)\k<qoute>\s\}/;
  const { groups: { collection, index, value } } = dupErrMsgRegEx.exec(err.errmsg);
  const name = normalizeIndexName(index);
  return {
    code: 'ValidationError',
    message: `${collection} validation failed`,
    details: [{
      name,
      type: 'taken',
      value,
      message: `${name} already exists`,
    }],
  };
};
