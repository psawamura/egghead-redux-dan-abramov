export const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
      case 'SET_VISIIBILITY_FILTER':
          return action.filter;
      default:
          return state;
  }
}