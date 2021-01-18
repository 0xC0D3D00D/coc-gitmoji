const { sources, workspace } = require('coc.nvim')
const gitmojis = require('./gitmojis.json')

exports.activate = async context => {
  let source = {
    name: 'gitmoji',
    triggerOnly: true,
    doComplete: async function() {
      return {
        items: gitmojis.map(g => {
          return {
            word: g.emoji,
            abbr: `${g.emoji} ${g.description}`,
            menu: this.menu,
            filterText: g.description,
          }
        })
      }
    },
    onCompleteDone: async (item, opt) {
      let { nvim } = workspace
      let { linenr, col, input, line } = opt
      let buf = Buffer.from(line, 'utf8')
      let pre = buf.slice(0, col - 1).toString('utf8')
      let after = buf.slice(col + input.length).toString('utf8')
      await nvim.call('coc#util#setline', [linenr, `${pre}${item.word}${after}`])
      await nvim.call('cursor', [linenr, Buffer.byteLength(`${pre}${item.word}`) + 1])
    },
  }

  context.subscriptions.push(sources.createSource(source))
}
