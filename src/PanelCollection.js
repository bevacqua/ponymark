function PanelCollection (postfix) {
  this.buttonBar = doc.getElementById('pmk-button-bar' + postfix);
  this.preview = doc.getElementById('pmk-preview' + postfix);
  this.input = doc.getElementById('pmk-input' + postfix);
}

module.exports = PanelCollection;
