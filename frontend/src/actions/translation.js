import { setCookie } from '../workingWithCookie'

export const setLanguage = lang => {
  return (dispatch, getState) => {
    console.log(getState());
    getState().language.i18n.init({
      lng: lang,
      resources: require(`../locales/${lang}.json`)
    })
    .then(() => {
      dispatch({type: 'START_LOADING_GENRES'})
      return fetch(`/api/novels/genres/${lang}`)
    })
    .then(res => res.json())
    .then(genres => {
      setCookie('lang', lang, {'max-age': 60 * 60 * 24 * 7});
      dispatch({
        type: 'SET_LANGUAGE',
        lang,
        genres
      })
    });
  }
}