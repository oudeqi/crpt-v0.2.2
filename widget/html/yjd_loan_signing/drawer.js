function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

var AppDrawer = {
  template: "\n    <div class=\"full-mask\" @click=\"onMaskClick\">\n      <div class=\"drawer\">\n        <div class=\"drawer-content\">\n          <slot></slot>\n        </div>\n        <div class=\"drawer-close\" @click=\"onClick\"></div>\n      </div>\n    </div>\n  ",
  methods: {
    onClick: function onClick() {
      this.$emit('on-close');
    },
    onMaskClick: function onMaskClick(e) {
      if (e.target.className.includes('dialog-mask')) {
        this.$emit('update:show', false);
      }
    }
  }
};

function vmInit() {
  return new Vue({
    el: '#app',
    components: {
      'app-drawer': AppDrawer
    },
    data: function data() {
      return {
        inputValue: '',
        code: new Array(6).fill('')
      };
    },
    mounted: function mounted() {},
    watch: {
      inputValue: function inputValue(val) {
        var a = val.split('');

        if (a.length < 6) {
          a.push.apply(a, toConsumableArray(new Array(6 - a.length).fill('')));
        }

        a.splice(6);
        this.code = a;
      }
    },
    methods: {
      onClose: function onClose() {
        api.closeFrame({
          name: 'drawer'
        });
      },
      handleInputClick: function handleInputClick() {
        this.$refs['hidden_ipt'].focus();
      }
    }
  });
}

apiready = function apiready() {
  var vm = vmInit();
};
