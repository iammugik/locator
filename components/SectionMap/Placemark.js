const iconMap = {
  Default: {
    url: '/images/markers/special.svg'
  },
  Tatneft: {
    url: '/images/markers/tatneft.svg'
  },
  Gazprom: {
    url: '/images/markers/gazprom.svg'
  },
  Gazpromneft: {
    url: '/images/markers/opti.svg'
  },
  Lukoil: {
    url: '/images/markers/lukoil.svg'
  },
  Rosneft: {
    url: '/images/markers/rosneft.svg'
  },
  Washing: {
    url: '/images/markers/wash.svg'
  },
  Shower: {
    url: '/images/markers/wash.svg'
  },
  Tire: {
    url: '/images/markers/tire.svg'
  },
  TireWash: {
    url: '/images/markers/tire-wash.svg'
  }
}

export const getIconUrl = vendorName => {
  let icon
  if (
    !vendorName.match(
      /Газпром|Gazprom|Опти|Opti|Лукойл|Lukoil|Роснефт|Rosneft|Татнефт|Tatneft|Мойка|Шино/i
    )
  ) {
    icon = iconMap.Default
  } else if (vendorName.match(/Татнефт|Tatneft/i)) {
    icon = iconMap.Tatneft
  } else if (vendorName.match(/Лукойл|Lukoil/i)) {
    icon = iconMap.Lukoil
  } else if (vendorName.match(/Газпромнефть|Gazpromneft|Опти|Opti/i)) {
    icon = iconMap.Gazpromneft
  } else if (vendorName.match(/Газпром|Gazprom/i)) {
    icon = iconMap.Gazprom
  } else if (vendorName.match(/Роснефт|Rosneft/i)) {
    icon = iconMap.Rosneft
  } else if (vendorName.match(/Мойка/i)) {
    if (vendorName.match(/Шино/i)) {
      icon = iconMap.TireWash
    } else {
      icon = iconMap.Shower
    }
  } else if (vendorName.match(/Шино/i)) {
    icon = iconMap.Tire
  } else {
    icon = iconMap.Washing
  }
  return icon.url
}

export const getPlacemarkContent = (info, address) => {
  let content = ''

  const contentHeader = `
    <div class="box box--map">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <h6>${info.vendor.name}</h6>
            <div>
              <small>
                <i class="fal fa-map-marked-alt"></i> ${info.address}
              </small>
            </div>
            <div>
              <small>
                <i class="fal fa-compass"></i>
                ${info.latitude}, ${info.longitude}
              </small>
            </div>
  `
  content += contentHeader

  if (info.placeserviceSet.edges.length !== 0) {
    let gas = info.placeserviceSet.edges.map(value => {
      return value.node.service.name
    })
    gas = gas.join(', ')
    let contentGas = `
      <div>
        <small>
          <i class="fal fa-gas-pump"></i> ${gas}
        </small>
      </div>
    `
    content += contentGas
  }

  if (info.phone !== '') {
    let contentPhone = `
      <div>
        <small>
          <i class="fal fa-phone"></i> ${info.phone}
        </small>
      </div>`
    content += contentPhone
  }

  if (info.cards.edges.length !== 0) {
    let card = ''
    info.cards.edges.map(value => {
      let image
      card = card + `<div>`
      if (value.node.image !== '') {
        image = `<img src="https://locator.expcard.ru/azs/media/${
          value.node.image
        }" width="40" height="25" alt="${
          value.node.name
        }" style="width: 40px; vertical-align: middle;">`
        card = card + image
      }
      card = `${card} ${value.node.name}</div>`
    })

    let contentCard = `
      <hr>
      <div style="font-weight: 400;">
          ${card}
      </div>
    `
    content += contentCard
  }

  if (info.placeserviceSet.edges.length !== 0) {
    let fuel = ''
    info.placeserviceSet.edges.map(value => {
      if (value.node.price > 0) {
        let FuelDate = new Date(value.node.date)
        let FuelDateFormatter = new Intl.DateTimeFormat('ru')
        let FuelDatePrint = FuelDateFormatter.format(FuelDate)
        fuel = `${fuel}<div>${value.node.service.name}: <b>${
          value.node.price
        } ₽</b> <span style="color: #636363;"> на ${FuelDatePrint}</span></div>`
      }
    })

    let contentFuel = `
      <hr>
      <div style="font-weight: 400;">
          ${fuel}
      </div>
    `
    content += contentFuel
  }

  let contentFooter = `
          </div>
          <hr>
          <nav class="level is-mobile">
            <div class="level-left">
              <button class="button-add-route button level-item"
                onclick="$nuxt.$root.$emit('addRoute', {
                  latitude: ${info.latitude},
                  longitude: ${info.longitude},
                  value: '${address}'
                });">
                 Добавить в маршрут
               </button>
            </div>
          </nav>
        </div>
      </article>
    </div>
  `
  content += contentFooter
  return content
}
