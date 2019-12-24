import i18next from 'i18next'

const initState = {
  i18n: i18next,
  lang: 'en',
  genres: {
    val: undefined,
    isLoading: false
  }
}

const language = (state = initState, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        lang: action.lang,
        genres: {
          val: action.genres,
          isLoading: false
        }
      }
      
    case 'START_LOADING_GENRES':
      return {
        ...state,
        genres: {
          ...state.genres,
          isLoading: true
        }
      }
  
    default:
      return {...state}
  }
}

export default language;