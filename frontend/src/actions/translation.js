export const setLanguage = lang => {
  return (dispatch, getState) => {
    console.log(getState());
    dispatch({
      type: 'SET_LANGUAGE',
      lang
    })
  }
}