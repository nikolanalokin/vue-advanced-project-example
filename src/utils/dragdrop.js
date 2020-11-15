const xy_sides = ['left','top','right','bottom']
const x_sides = ['left','right']
const y_sides = ['top','bottom']

import EventDispatcher from './emitter'

class DragDrop extends EventDispatcher {
  constructor ({
    containerEl = document.getElementById('app'),
    targetEl,
    checkOverlap = true,
    targetSelector,
    ignoreSelector,
  }) {
    super()

    this.targetEl = null
    this.containerEl = containerEl
    this.ignoreSelector = ignoreSelector
    this.targetSelector = targetSelector
    this.checkOverlap = checkOverlap

    this.active = false
    this.dragging = false
    this.disabled = false

    this.targetEl = targetEl || this.containerEl.querySelector(this.targetSelector)

    this._update()

    this.targetEl.style.position = 'fixed'
    this.targetEl.style.right = 'unset'
    this.targetEl.style.bottom = 'unset'

    this._render(this.position.x, this.position.y)

    this._initEventListeners()
  }

  _initEventListeners () {
    this.targetEl.addEventListener('mousedown', this._grab.bind(this))
    this.containerEl.addEventListener('mousemove', this._move.bind(this))
    this.targetEl.addEventListener('mouseup', this._drop.bind(this))
    window.addEventListener('resize', this.update.bind(this))
  }
  
  _update () {
    let coords = DragDrop.getFixedCoords(this.targetEl)
    this.position = {
      x: coords.left,
      y: coords.top
    }
    this.box = {
      width: coords.width,
      height: coords.height
    }
  }
  
  _render (x, y) {
    this.targetEl.style.left = x + 'px'
    this.targetEl.style.top = y + 'px'
  }

  _checkOverlap (x, y) {
    this.overlap = {
      x: x < 0 ? -1 : x + this.box.width > document.documentElement.clientWidth ? 1 : 0,
      y: y < 0 ? -1 : y + this.box.height > document.documentElement.clientHeight ? 1 : 0,
    }
  }

  _getCoords (x, y) {
    let position
    if (this.checkOverlap) {
      this._checkOverlap(x, y)
      position = {
        x: this.overlap.x == 0 ? x : this.overlap.x == -1 ? 0 : document.documentElement.clientWidth - this.box.width,
        y: this.overlap.y == 0 ? y : this.overlap.y == -1 ? 0 : document.documentElement.clientHeight - this.box.height
      }
    } else {
      position = {
        x,
        y
      }
    }
    return position
  }
  
  _grab (e) {
    let ignoreEl = e.target.closest(this.ignoreSelector)
  
    if (!ignoreEl && e.which == 1 && !this.disabled) {
      this._update()

      this.mouse = {
        x: e.screenX,
        y: e.screenY
      }

      this.shift = {
        x: this.mouse.x - this.position.x,
        y: this.mouse.y - this.position.y
      }
  
      this.dispatch('start-drag')
      
      this.active = true
    }
  }
  
  _move (e) {
    if (this.targetEl && this.active && e.which == 1) {
      let position = {
        x: e.screenX - this.shift.x,
        y: e.screenY - this.shift.y
      }

      let { x, y } = this._getCoords(position.x, position.y)

      this._render(x, y)

      this.position = {
        x,
        y
      }
      
      this.dragging = true
  
      this.dispatch('dragging')
    }
  }
  
  _drop (e) {
    if (e.which == 1) {
      this.active = false
      this.dragging = false
    
      this.dispatch('end-drag')
    
      return false
    }
  }
  
  moveTo (x, y) {
    if (this.targetEl) {
      this._update()
      
      let position = this._getCoords(x, y)

      this._render(position.x, position.y)
  
      this.dispatch('dragging')
    }
  }

  update () {
    this._update()
    let position = this._getCoords(this.position.x, this.position.y)
    this._render(position.x, position.y)
  }
  
  destroy () {
    this.targetEl.removeEventListener('mousedown', this._grab.bind(this))
    this.containerEl.removeEventListener('mousemove', this._move.bind(this))
    this.targetEl.removeEventListener('mouseup', this._drop.bind(this))
    window.removeEventListener('resize', this.update.bind(this))
  }

  static getFixedCoords (el) {
    let box = el.getBoundingClientRect()
    return {
      top: box.top,
      left: box.left,
      bottom: box.top + box.height,
      right: box.left + box.width,
      width: box.width,
      height: box.height,
    }
  }
}

export default DragDrop
