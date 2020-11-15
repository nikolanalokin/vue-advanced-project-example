export const routerLinkProps = {
  to: [String, Object],
  exact: Boolean,
  append: Boolean,
  replace: Boolean,
  activeClass: String,
  exactActiveClass: String,
  disable: Boolean
}

export const RouterLinkMixin = {
  props: routerLinkProps,

  computed: {
    hasRouterLink () {
      return this.disable !== true && this.to !== void 0 && this.to !== null && this.to !== ''
    },

    routerLinkProps () {
      return {
        to: this.to,
        exact: this.exact,
        append: this.append,
        replace: this.replace,
        activeClass: this.activeClass || 'n-router-link--active',
        exactActiveClass: this.exactActiveClass || 'n-router-link--exact-active',
        event: this.disable === true ? '' : void 0
      }
    }
  }
}
