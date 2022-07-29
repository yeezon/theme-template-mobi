function broadcast (componentName, evtName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name

    if (name === componentName) {
      child.$emit.apply(child, [evtName].concat(params))
    } else {
      broadcast.apply(child, [componentName, evtName].concat([params]))
    }
  })
}
export default {
  methods: {
    dispatch (componentName, evtName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [evtName].concat(params))
      }
    },
    broadcast (componentName, evtName, params) {
      broadcast.call(this, componentName, evtName, params)
    }
  }
}
