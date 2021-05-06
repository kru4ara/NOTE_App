import { DnD } from './dnd'

class Note {

  data = [];
  editNoteClass = 'card_edit';
  DnD = DnD;
  bg = '#0d6efd';

  constructor(wrapSelector = null, buttonSelector = null, inputColorSelector = null) {
    this.wrapElement = document.querySelector(wrapSelector) || document.body;
    this.buttonElement = document.querySelector(buttonSelector);
    this.inputColorElement = document.querySelector(inputColorSelector);

    this.#init();

  }

  #init() {
    if (!this.buttonElement) {
      const error = new Error('Вы не указали кнопку!');
      console.error(error);

      return;
    }

    this.#eventListeners();
  };

  #eventListeners() {
    this.buttonElement.addEventListener('click', this.#handleButtonAddNote.bind(this)); // Добавление заметки
    document.addEventListener('dblclick', this.#handleDoubleClick.bind(this)); // Двойной клик для редактирования заметки
    document.addEventListener('click', this.#handleClickButtonSubmit.bind(this)); // Редактирование заметки
    this.inputColorElement.addEventListener('change', this.#handleChangeColor.bind(this)); // Изменение цвета заметки
  };


  #handleButtonAddNote() {
    this.#addNote();
    this.render();
  };

  #handleChangeColor({ target }) {
    const { value } = target

    this.bg = value
  }

  #handleDoubleClick(event) {
    const { target } = event;
    const cardElement = target.closest('.card');

    if (cardElement) {
      cardElement.classList.add(this.editNoteClass);
    }
  }

  #handleClickButtonSubmit(event) {
    event.preventDefault();
    const { target } = event;

    if (target.getAttribute('type') == 'submit') {
      const textareaElement = target.previousElementSibling;
      const cardElement = target.closest('.card');

      const { id } = cardElement.dataset;
      const index = this.#getIndexSelectedNote(id);
      this.data[index].content = textareaElement.value;

      this.render();
    };
  }

  #addNote() {
    const noteData = {
      id: new Date().getTime(),
      content: 'Double click to edit',
      bg: this.bg,
      position: { left: 'auto', top: 'auto' }
    }

    this.data.push(noteData);
  }

  #buildNoteElement(noteData) {
    const { id, content, position, bg } = noteData;
    const dndWrapElement = document.createElement('div');

    this.#setPosition(position, dndWrapElement);
    dndWrapElement.classList.add('dnd');
    new this.DnD(dndWrapElement);

    dndWrapElement.addEventListener('dnd:end', (event) => {
      const { position } = event.detail;
      const index = this.#getIndexSelectedNote(id);

      this.data[index].position = position;
      this.#setPosition(position, dndWrapElement);
    })

    dndWrapElement.addEventListener('click', this.#handleClickClose.bind(this))

    const template = `
          <div data-id="${id}" class="card mt-2" style="background-color: ${bg}">
            <div class="card__content">${content}</div>
            <form class="card__form mt-1">
              <textarea class="w-170 me-4" rows="7">${content}</textarea>
              <button type="submit" class="btn btn-sm btn-success">Save</button>
            </form>
            <button class="btn btn-sm btn-primary card__close">Close</button>
          </div>
        `;

    dndWrapElement.innerHTML = template;

    return dndWrapElement;
  };

  #handleClickClose(event) {
    const { target } = event

    if (target.classList.value.includes('card__close')) {
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this.#getIndexSelectedNote(id)
      this.data.splice(index, 1)

      this.render()
    }
  }

  #getIndexSelectedNote(id) {
    let index = 0;

    this.data.forEach((item, i) => {
      if (item.id == id) {
        index = i;
      }
    })

    return index;
  }

  #setPosition({ left, top }, element) {
    element.style.left = left;
    element.style.top = top;
  }
  render() {
    this.wrapElement.innerHTML = '';

    this.data.forEach((item) => {
      const noteElement = this.#buildNoteElement(item);
      this.wrapElement.append(noteElement);
    })
  }
}

export { Note };