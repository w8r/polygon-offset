import L from 'leaflet';

export default L.Control.extend({
  options: {
    position: 'topright',
    defaultMargin: 20,
    defaultArcSegments: 15
  },

  onAdd: function(map) {
    const container = this._container = L.DomUtil.create('div', 'leaflet-bar');
    this._container.style.background = '#ffffff';
    this._container.style.padding = '10px';
    container.innerHTML = `
      <form>
        <div>
          <label>
            <input type="range" min="0" max="100" value="${this.options.defaultMargin}" name="margin">
            offset
          </label>
        </div>
        <div>
          <input type="number" min="0" max="100" step="1" value="${this.options.defaultArcSegments}" name="arcSegments">
          <label>
            join segments
          </label>
        </div>
        <div>
          <label> <input type="radio" name="operation" value="1" checked>  margin</label>
          <label> <input type="radio" name="operation" value="-1">  padding</label>
        </div> <br>
        <input type="submit" value="Run"><input name="clear" type="button" value="Clear layers">
      </form>`;

    const form = container.querySelector('form');
    L.DomEvent
      .on(form, 'submit change', function (evt) {
        L.DomEvent.stop(evt);
        const margin = parseFloat(form['margin'].value);
        const arcSegments = parseFloat(form['arcSegments'].value);
        const radios = Array.prototype.slice.call(
          form.querySelectorAll('input[type=radio]'));
        let k = 1;
        for (var i = 0, len = radios.length; i < len; i++) {
          if (radios[i].checked) {
            k *= parseInt(radios[i].value);
            break;
          }
        }
        this.options.callback(margin * k, arcSegments);
      }, this)
      .on(form['clear'], 'click', function(evt) {
        L.DomEvent.stop(evt);
        this.options.clear();
      }, this);

    L.DomEvent
      .disableClickPropagation(this._container)
      .disableScrollPropagation(this._container);
    return this._container;
  }
});
