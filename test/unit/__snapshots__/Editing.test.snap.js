/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["Editing Element updates an element's attributes on Update Action"] = 
`<Substation
  name="A2"
  sxy:x="1"
  sxy:y="1"
>
</Substation>
`;
/* end snapshot Editing Element updates an element's attributes on Update Action */

snapshots["Editing Element removes an element on Remove Action"] = 
`<SCL
  revision="B"
  version="2007"
  xmlns="http://www.iec.ch/61850/2003/SCL"
  xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates"
>
  TextNode
  <Communication>
    <SubNetwork
      name="NONE"
      type="8-MMS"
    >
    </SubNetwork>
  </Communication>
  <test>
  </test>
</SCL>
`;
/* end snapshot Editing Element removes an element on Remove Action */

