
export default function (oPro) {
  const _oPro = oPro || {}

  let _options = (_oPro.attr_sale || []).map((attr, index) => {
    return {
      id: window.parseInt('1' + index + index + index + index),
      name: attr,
      values: [],
      position: index + 1
    }
  })

  const _variants = (_oPro.item_skus || []).map((oSku, index) => {
    const _oSku = JSON.parse(JSON.stringify(oSku))

    _oSku.options = []

    if (_oSku.attr1 && _options[0]) {
      _options[0].values.push(_oSku.attr1)
      // 去重
      _options[0].values = [...new Set(_options[0].values)]

      _oSku.options.push({
        option_id: _options[0].id,
        option_value: _oSku.attr1,
        position: _options[0].values.indexOf(_oSku.attr1) + 1
      })
    }
    if (_oSku.attr2 && _options[1]) {
      _options[1].values.push(_oSku.attr2)
      // 去重
      _options[1].values = [...new Set(_options[1].values)]

      _oSku.options.push({
        option_id: _options[1].id,
        option_value: _oSku.attr2,
        position: _options[1].values.indexOf(_oSku.attr2) + 1
      })
    }
    if (_oSku.attr3 && _options[2]) {
      _options[2].values.push(_oSku.attr3)
      // 去重
      _options[2].values = [...new Set(_options[2].values)]

      _oSku.options.push({
        option_id: _options[2].id,
        option_value: _oSku.attr3,
        position: _options[2].values.indexOf(_oSku.attr3) + 1
      })
    }

    return _oSku
  })

  // 去掉 values 空的 option
  _options = _options.filter(opt => {
    return opt.values.length
  })

  return {
    variants: _variants,
    options: _options
  }
}
