import { oids } from './oids'
import Base64 from './Base64'
import { ASN1 } from './asn1'
import { certPEMString } from './cert'

let NUM_CHILD = 0;
const lineLength = 80;
let contentLength = 8 * lineLength;

const Node = function (prop) {
  // (prop) ? this.prop = prop : null;
  this.prop = prop
};

Node.prototype.NewAppendChild = function (child) {
  this[NUM_CHILD++ + this.prop] = child
  return this;
}

ASN1.prototype.toObject = function () {
  var node = new Node("node");

  // 1. BEGIN asn1Type propertie
  node["asn1Type"] = this.typeName().replace(/_/g, " ")

  let content = this.content(contentLength);
  node["content"] = this.content()

  if (this.content() !== null) {
    var shortContent = '';
    content = String(content); // it might be a number
    shortContent = (content.length > lineLength) ? content.substring(0, lineLength) + "\u2026" : content;

    // BEGIN Preview -> to show Lapo Luchini awesome tree style
    node["preview"] = shortContent;

    // BEGIN oid -> to show Lapo Luchini awesome tree style
    if ((typeof oids === 'object') && (this.tag.isUniversal() && (this.tag.tagNumber == 0x06))) {
      var oid = oids[content];
      if (oid) {
        (oid.d) ? node.oidd = oid.d: null(oid.c) ? node.oidc = oid.c : null
      }
    }
  }

  // 3. BEGIN differents node values frome ASN1 parser (aka this)
  node["posStart"] = this.posStart();
  node["posContent"] = this.posContent();
  node["posEnd"] = this.posEnd();
  // node["offset"] = this.stream.pos
  // node["header"] = this.header

  (this.length >= 0) ? node.lenght = this.length: node.lenght = (-this.length) + " (undefined)";
  (this.tag.tagConstructed) ?
  node.tag = "(constructed)": ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) ?
    node.tag = "(encapsulates)" :
    null
  //from Luchini: TODO if (this.tag.isUniversal() && this.tag.tagNumber == 0x03) s += "Unused bits: "

  if (content !== null) {
    node["value"] = content;
    if ((typeof oids === 'object') && (this.tag.isUniversal() && (this.tag.tagNumber == 0x06))) {
      (oids[content]) ? node["warning"] = oids[content]: null
    }
  }
  // END values

  // BEGIN sub -> the magic recursive part og Lapo Luchini ASN1 parser
  var sub = new Node("sub");
  if (this.sub !== null) {
    for (var i = 0, max = this.sub.length; i < max; ++i)
      sub.NewAppendChild(this.sub[i].toObject());
  }
  delete node.prop // useless prop "node" value tag
  node.childs = Object.values(sub).slice(1) // skip the useless prop "sub" value tag

  node["hexString"] = this.toHexString()
  return node;
};


const DER = Base64.unarmor(certPEMString)
// console.log(DER)

export const asn1 = ASN1.decode(DER);

