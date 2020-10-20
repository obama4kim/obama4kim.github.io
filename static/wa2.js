// �녑릎�⒲궎�뽧꺀��
// Ref: http://phiary.me/webaudio-api-getting-started/

;(function(window){

  var wa2 = {

    context: null,
    _buffers: {},

    _initialize: function() {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    },

    playSilent: function() {
      var context = this.context;
      var buf = context.createBuffer(1, 1, 22050);
      var src = context.createBufferSource();
      src.buffer = buf;
      src.connect(context.destination);
      src.start(0);
    },

    play: function(buffer) {
      // �뺛궊�ㅳ꺂�띲겎�뉐츣
      if (typeof buffer === "string") {
        buffer = this._buffers[buffer];
        if (!buffer) {
          console.error('�뺛궊�ㅳ꺂�뚨뵪�뤵겎�띲겍�얇걵��!');
          return;
        }
      }

      var context = this.context;
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);

    },

    loadFile: function(src, cb) {
      var self = this;
      var context = this.context;
      var xml = new XMLHttpRequest();
      xml.open('GET', src);
      xml.onreadystatechange = function() {
        if (xml.readyState === 4) {
          if ([200, 201, 0].indexOf(xml.status) !== -1) {

            var data = xml.response;

            // webaudio �ⓦ겓鸚됪룢
            context.decodeAudioData(data, function(buffer) {
              // buffer�삯뙯
              var s = src.split('/');
              var key = s[s.length-1];
              self._buffers[key] = buffer;

              // �녈꺖�ャ깘�껁궚
              cb(buffer);
            });

          } else if (xml.status === 404) {
            // not found
            console.error("not found");
          } else {
            // �듐꺖�먦꺖�ⓦ꺀��
            console.error("server error");
          }
        }
      };

      xml.responseType = 'arraybuffer';

      xml.send(null);
    },

  };

  wa2._initialize(); // audioContext�믤뼭誤뤶퐳��

  window.wa2 = wa2;

}(window));