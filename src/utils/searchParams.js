function updateSearchParams(type, newParam, history) {
  const searchParams = new URLSearchParams(history.location.search)
  searchParams.set(type, newParam)

  const stringParams = searchParams.toString()
  history.push({
    pathname: history.location.pathname,
    search: stringParams
  })
}

function removeSearchParam(type, history) {
  const searchParams = new URLSearchParams(history.location.search)
  searchParams.delete(type)

  const stringParams = searchParams.toString()
  history.push({
    pathname: history.location.pathname,
    search: stringParams
  })
}

function setQuery(query, history, callBack) {
  // reset offset
  removeSearchParam('offset', history)

  if(query) {
    updateSearchParams('query', query, history)
  } else removeSearchParam('query', history)

  callBack()
}

function getQuery(history) {
  const searchParams = new URLSearchParams(history.location.search)
  const query = searchParams.get('query')
  if(query) {
    return query
  } else return null
}

function setTrackLimit(limit, history, callBack) {
  // reset offset
  removeSearchParam('offset', history)

  if(limit) {
    updateSearchParams('limit', limit, history)
  } else removeSearchParam('limit', history)
  callBack()
}

function getTrackLimit(history) {
  const searchParams = new URLSearchParams(history.location.search)
  const limit = searchParams.get('limit')
  if(limit) {
    return limit
  } else return 30
}

function setOffset(offset, history, callBack) {
  if(offset) {
    updateSearchParams('offset', offset, history)
  } else removeSearchParam('offset', history)
  callBack()
}


function getOffset(history) {
  const searchParams = new URLSearchParams(history.location.search)
  const offset = searchParams.get('offset')
  if(offset) {
    return offset
  } else return 0
}

function setFilter(filter, history, callBack) {
  // reset offset
  removeSearchParam('offset', history)

  if(filter) {
    updateSearchParams('filter', filter, history)
  } else removeSearchParam('filter', history)
  callBack()
}

function getFilter(history) {
  const searchParams = new URLSearchParams(history.location.search)
  const filter = searchParams.get('filter')
  if(filter) {
    return filter
  } else return null
}

export {
  updateSearchParams,
  removeSearchParam,
  setQuery,
  getQuery,
  setTrackLimit,
  getTrackLimit,
  setOffset,
  getOffset,
  setFilter,
  getFilter
}