var DEFAULTS =  {
  model: {
    active: { id: null },
    list: MODELS
  },
  cordLength: {
    active: 'small',
    small: {
      name: '100см'
    },
    medium: {
      name: '130см'
    },
    large: {
      name: '160см',
      price: 5
    }
  },
  cordSelector: {
    active: 'AA',
    AA: { price: 60},
    change: { price: 30},
    old: { price: 0}
  },
  jack: {
    active: 'угловой',
    angle: "угловой",
    straight: "прямой"
  },
  engraving: {
    active: false,
    price: 10,
    text: ''
  },
  ventilation: {
    active: false,
    price: 20
  },
  filterSulfur: {
    active: false,
    price: 10
  },
  fabricCase: {
    active: false,
    price: 2.5
  },
  drierCapsule: {
    active: false,
    price: 2.5
  },
  sulfurStick: {
    active: false,
    price: 3
  },
  namedCase: {
    active: false,
    price: 30
  },
  customer: {
    userName: '',
    email: '',
    surname: '',
    name: '',
    secondName: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    phone: '',
    misc: ''
  }
}
