import { Todo } from "../types/types";

export const fetchTheme = () => {
  const theme: string | null = localStorage.getItem("theme");
  if (theme) {
    return JSON.parse(theme)
  } else {
    return false;
  }
}

export const fetchTodos = (type: string) => {
  const todoList: string | null = localStorage.getItem("todo");
  const dailyList: string | null = localStorage.getItem("dailies"); 
  const shortcuts: string | null = localStorage.getItem("shortcuts");
  if (type === 'todo') {
    if (todoList && JSON.parse(todoList).length) {
      return JSON.parse(todoList);
    } else return []
  } else if (type === 'daily') {
    if (dailyList && JSON.parse(dailyList).length) {
      const dailies = JSON.parse(dailyList);
      const currentDay = new Date().getDate();
      const refreshedDailies = dailies.map((daily: Todo) => {
        if (daily.cycleStamp !== currentDay) {
          return {...daily, completed: false, cycleStamp: new Date().getDate()}
        } else {
          return daily;
        }
      })
      return refreshedDailies;
    } else return []
  } else if (type === 'shortcuts') {
    if (shortcuts && JSON.parse(shortcuts).length) {
      return JSON.parse(shortcuts)
    } else return []
  }
}
  
export const fetchUsername = () => {
  const username = localStorage.getItem('username');
  if (username) {
    return username;
  } else {
    return '';
  }
}
  
export const fetchFavIcon = async (urlInput: string): Promise<string | undefined> => {
  let favIcoUrl;
  try {
    const response = await fetch(`https://www.google.com/s2/favicons?domain=${urlInput}&sz=128`)
    console.log(response.body);
    // Favicon not found
    if (response.status === 404) {
      favIcoUrl = undefined;
    } else {
      favIcoUrl = response.url;
    }
  } catch (error) {
    console.log(error);
  }
  return favIcoUrl
}

export const trapFocus = (closeModal: () => void) => {
  const modal: HTMLDivElement | null = document.querySelector('#modal');
  if (modal) {
    const focusableEls = modal.querySelectorAll<HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    
    // Set focus to first element when modal opens
    firstEl.focus();
  
    const handleTabKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastEl
        ) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    };
  
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // setModalOpen(false);
        closeModal();
      }
    };

    modal.addEventListener("keydown", handleTabKeyPress);
    modal.addEventListener("keydown", handleEscapeKeyPress);
  }
}