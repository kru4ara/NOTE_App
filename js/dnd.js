class DnD {
  shifts = {
    x: 0,
    y: 0
  }

  constructor(element) {
    this.element = element
    this.handleMousemove = this._handleMousemove.bind(this)
    this._init()
  }

  _init() {
    this.element.addEventListener('mousedown', (event) => {
      this._handleMousedown(event)
    })
    document.addEventListener('mouseup', this._handleMouseup.bind(this))
  }

  _handleMousedown(event) {
    const { clientX, clientY } = event

    this._calcShifts({ clientX, clientY })
    document.addEventListener('mousemove', this.handleMousemove)
  }

  _handleMousemove(event) {
    const { clientX, clientY } = event

    this._setPosition({ clientX, clientY })
  }

  _handleMouseup() {
    document.removeEventListener('mousemove', this.handleMousemove)
  }

  _calcShifts(coords) {
    const { clientX, clientY } = coords
    const rect = this.element.getBoundingClientRect()

    this.shifts.x = clientX - rect.left
    this.shifts.y = clientY - rect.top
  }

  _setPosition(coords) {
    const { clientX, clientY } = coords

    this.element.style.left = (clientX - this.shifts.x) + 'px'
    this.element.style.top = (clientY - this.shifts.y) + 'px'
  }
}

export { DnD }