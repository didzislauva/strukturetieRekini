# Strukturēto rēķinu (xml) ģenerators atbilstoši PEPPOL standartam

## Apraksts

Šis projekts ļauj izveidot XML formāta e-rēķinus atbilstoši PEPPOL un EN16931 standartiem. Izveidotais rēķins ir saderīgs ar Eiropas elektronisko rēķinu izsniegšanas vadlīnijām.

## Funkcijas

- Ērti aizpildāmas ievades formas rēķina datiem.
- Automātiska XML ģenerēšana atbilstoši UBL (Universal Business Language) specifikācijām.
- Noklusēti paslēptas papildu lauki, kurus iespējams atvērt un rediģēt nepieciešamības gadījumā.

## Kā lietot?

1. Atveriet `index.html` failu tīmekļa pārlūkā.
2. Aizpildiet nepieciešamo informāciju.
3. Nospiediet pogu **"Ģenerēt strukturēto rēķinu"**, lai lejupielādētu XML failu.

## XML failu validācija

Izveidotos XML failus varat pārbaudīt tiešsaistes validācijas rīkā:

- [Ecosio PEPPOL un XML dokumentu validētājs](https://ecosio.com/en/peppol-and-xml-document-validator/)
- [Eiropas Savienības eInvoice validētājs](https://www.itb.ec.europa.eu/invoice/upload)

Validācija palīdz pārliecināties, ka fails atbilst PEPPOL prasībām.

## Biežāk sastopamie brīdinājumi un kļūdas

### 1. Brīdinājums: `[UBL-CR-446]`
**Apraksts:**
> *A UBL invoice should not include the PaymentMeans PaymentMandate PayerFinancialAccount FinancialInstitutionBranch.*

**Risinājums:**
- No XML jāizņem `<cac:FinancialInstitutionBranch>` sadaļa, kas atrodas `<cac:PayerFinancialAccount>` blokā.

### 2. Brīdinājums: `[UBL-CR-504]`
**Apraksts:**
> *A UBL invoice should not include the TaxTotal TaxSubtotal TaxCategory Name.*

**Risinājums:**
- No XML jāizņem `<cbc:Name>` elements, kas atrodas `<cac:TaxCategory>` blokā.

## Noderīgas atsauces

- [PEPPOL UBL rēķinu dokumentācija](https://docs.peppol.eu/poacc/billing/3.0/)
- [UBL standarta dokumentācija (OASIS)](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=ubl)
- [Eiropas e-rēķinu standarts EN16931](https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:60602,1883209&cs=1E67269B3DDECC9FF6E78C97692B22D75)

---

Šis projekts atvieglo strukturēto e-rēķinu izveidi un to atbilstību Eiropas elektronisko rēķinu standartiem. Pārbaudīts, augšuplādējot to Latvija.lv sistēmā un pievienojot e-adresei.

![image](https://github.com/user-attachments/assets/0ab12e6f-f72c-41ec-92d4-f1f481344c5b)
