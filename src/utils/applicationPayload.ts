export type ProcessPayload = {
  process: {
    profile: {
      images: {
        Documentation: {
          frontPersonalDocument: string;
          backPersonalDocument: string;
        };
        PersonData: { personPhoto: string };
        revisionApplicantInformation: { documents: string[] };
        business: {
          products: Array<{
            productType: string;
            measurementUnit: string;
            quantity: number;
            unitCost: number;
            totalCost: number;
            totalSales: number;
            profitMargin: number;
            monthlyStatus: Record<string, 'good' | 'bad' | 'neutral'>;
            totalSalesGoodMonths: number;
            totalSalesBadMonths: number;
            productImage: string;
          }>;
        };
      };
      personalDocument: {
        personalDocumentId: string;
        firstName: string;
        secondName: string;
        firstLastName: string;
        secondLastName: string;
        nationality: string;
        birthDate: string;
        birthDateMillis: number;
        personalDocumentAddress: { fullAddress: string };
        occupation: string;
        typeOfHousing: string;
        maritalStatus: string;
        fullName: string;
        spouseFirstName: string;
        spouseSecondName: string;
        spouseThirdName: string;
        spouseFirstLastName: string;
        spouseSecondLastName: string;
        spouseThirdLastName: string;
        spousePersonalDocumentId: string;
        spouseOccupation: string;
        spouseTotalIncome: number;
      };
      personData: {
        nit: string;
        telephone: string;
        mobile: string;
        academicDegree: { itemId: string; value: string };
        email: Array<{ emailAddress: string; emailType: number; emailId: string }>;
        personHasDependants: boolean;
        numberOfDependants: number;
        numberOfDependantsStudents: number;
        characterAnalysis: {
          historyOfViolenceOrAlcoholic: boolean;
          livesInHighRiskZone: boolean;
          moreThanTwoYearsResidence: boolean;
          spouseHasKnowledgeAboutTheCredit: boolean;
          neighborsReferencesAreGood: boolean;
        };
        aboutTheProject: {
          applicantIsClearAboutPurposeOfCredit: boolean;
          businessInHighRiskZone: boolean;
          businessMoreThanOneYear: boolean;
          businessHasOtherEconomicActivity: boolean;
          businessHasPurchaseAndSalesBook: boolean;
        };
        recordPayment: {
          sibGoodReferences: boolean;
          goodInternalScore: boolean;
        };
      };
      revisionApplicantInformation: { personIsApplicant: boolean; reason: string };
      productiveInformation: { personIsClient: boolean };
      productDetail: {
        productDefinition: { type: string; typeId: string; name: string };
        modality: { itemId: string; value: string };
        requestedAmount: number;
        requestedInterestRate: number;
        requestedTerm: number;
        purpose: { itemId: string; value: string };
        guarantee: string;
        investmentPlace: string;
      };
      business: {
        companyName: string;
        businessAddress: { fullAddress: string };
        totalSales: number;
        costOfSales: number;
        grossProfit: number;
        administrativeExpenses: {
          bonuses: number;
          ownerSalary: number;
          administrativeSalaries: number;
          officeRent: number;
          water: number;
          electricity: number;
          telephone: number;
          freightAndFuel: number;
          otherExpenses: number;
        };
        totalAdministrativeExpenses: number;
        netProfit: number;
      };
    };
  };
};

// Helper functions for data conversion
const num = (v: any): number => {
  const n = typeof v === 'string' ? v.replace(/,/g, '') : v;
  const parsed = parseFloat(n);
  return Number.isFinite(parsed) ? parsed : 0;
};

const str = (v: any): string => (v ?? '').toString();

const yyyyMMdd = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const birthMillis = (iso?: string) => {
  const d = new Date(iso || '');
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

const maritalToEn = (v?: string): string => {
  switch (v) {
    case 'casado': return 'Married';
    case 'unido': return 'Cohabiting';
    case 'soltero': return 'Single';
    case 'divorciado': return 'Divorced';
    case 'viudo': return 'Widowed';
    default: return '';
  }
};

const housingToEn = (v?: string): string => {
  switch (v) {
    case 'propia': return 'Owned';
    case 'alquilada': return 'Rented';
    case 'familiar': return 'Family';
    case 'prestada': return 'Borrowed';
    default: return '';
  }
};

const degreeMap = (v?: string) => {
  const map: Record<string, { itemId: string; value: string }> = {
    ninguno: { itemId: '0', value: 'None' },
    primaria: { itemId: '1', value: 'Primary' },
    secundaria: { itemId: '2', value: 'Secondary' },
    diversificado: { itemId: '3', value: 'High school' },
    universitario: { itemId: '4', value: 'University' },
    postgrado: { itemId: '5', value: 'Postgraduate' },
  };
  return map[v || ''] || { itemId: '', value: '' };
};

const productDefinitionMap = (productType?: string) => {
  switch (productType) {
    case 'mialiada':
      return { type: 'Microcredit', typeId: 'MIAL', name: 'MiAliada' };
    case 'crediamiga':
      return { type: 'Microcredit', typeId: 'CRAM', name: 'CrediAmiga' };
    default:
      return { type: 'Microcredit', typeId: 'GEN', name: str(productType) || 'Generic' };
  }
};

const modalityMap = (mod?: string) =>
  mod === 'grupo'
    ? { itemId: '2', value: 'Group' }
    : mod === 'individual'
    ? { itemId: '1', value: 'Individual' }
    : { itemId: '', value: '' };

const docUrl = (docs: any, key: string): string => {
  const d = docs?.[key];
  return d?.thumbnailUrl || (typeof d?.file === 'string' ? d.file : '') || '';
};

const monthlyStatusFrom = (best: string[] = [], worst: string[] = []) => {
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'] as const;
  return months.reduce<Record<string, 'good' | 'bad' | 'neutral'>>((acc, m) => {
    if (best.includes(m)) acc[m] = 'good';
    else if (worst.includes(m)) acc[m] = 'bad';
    else acc[m] = 'neutral';
    return acc;
  }, {});
};

export function mapFormToApplicationPayload(formData: any): ProcessPayload {
  const docs = formData.documents || {};
  const cui = str(formData.cui || formData.personalInfo?.numeroDocumento);
  const firstName = str(formData.firstName || formData.personalInfo?.nombres?.split(' ')?.[0]);
  const secondName = str(formData.secondName || formData.personalInfo?.nombres?.split(' ')?.[1]);
  const firstLastName = str(formData.firstLastName || formData.personalInfo?.apellidos?.split(' ')?.[0]);
  const secondLastName = str(formData.secondLastName || formData.personalInfo?.apellidos?.split(' ')?.[1]);
  const birthIso = formData.birthDate || formData.personalInfo?.fechaNacimiento;
  const addressFull = str(formData.completeAddress?.direccionCompleta || formData.personalInfo?.direccion?.direccionCompleta);
  const nationality = str(formData.personalInfo?.nacionalidad || 'Guatemalan');

  // Productos del negocio
  const products = (formData.products || []).map((p: any) => {
    const qty = num(p.quantity);
    const unitCost = num(p.unitCost);
    const totalCost = unitCost * qty;
    const selling = num(p.sellingPrice);
    const totalSales = selling * qty;
    const profitMargin = totalSales - totalCost;
    return {
      productType: str(p.type),
      measurementUnit: str(p.unit),
      quantity: qty,
      unitCost,
      totalCost,
      totalSales,
      profitMargin,
      monthlyStatus: monthlyStatusFrom(p.bestMonths, p.worstMonths),
      totalSalesGoodMonths: num(p.bestAmount),
      totalSalesBadMonths: num(p.worstAmount),
      productImage: str(p.photo),
    };
  });

  // Totales del negocio
  const totalSales = num(formData.cashSales) + num(formData.creditSales);
  const costOfSales = products.reduce((a: number, p: any) => a + num(p.totalCost), 0);
  const grossProfit = totalSales - costOfSales;

  // Gastos administrativos
  const be = formData.businessExpenses || {};
  const administrativeExpenses = {
    bonuses: num(be.bonusesAndBonifications),
    ownerSalary: num(be.entrepreneurSalary),
    administrativeSalaries: num(be.adminSalary),
    officeRent: num(be.localRent),
    water: num(be.water),
    electricity: num(be.electricity),
    telephone: num(be.phone),
    freightAndFuel: num(be.freight),
    otherExpenses: num(be.otherExpenses),
  };
  const totalAdministrativeExpenses = Object.values(administrativeExpenses).reduce((a, v) => a + num(v), 0);
  const netProfit = grossProfit - totalAdministrativeExpenses;

  // Character y proyecto
  const areaRiskLevel = formData.areaRiskLevel; // 'bajo' | 'medio' | 'alto'
  const neighborReferences = formData.neighborReferences; // 'ninguna' | 'mixtas' | 'positivas'
  const creditPurposeClarityLevel = formData.creditPurposeClarityLevel; // 'alta' | 'media' | 'baja'
  const businessAntiquity = formData.businessAntiquity; // 'menos_6m' | '6_12m' | 'mas_1a'
  const recordKeepingLevel = formData.recordKeepingLevel; // 'ninguno' | 'informal' | 'formal'

  const emailAddress = str(formData.email || formData.personalInfo?.email);

  // Cónyuge
  const marriedOrUnion = ['casado','unido'].includes(str(formData.maritalStatus));
  const spouseName = str(formData.spouseName);
  const spouseParts = spouseName.split(' ');
  const spouseFirstName = str(spouseParts[0]);
  const spouseSecondName = str(spouseParts[1] || '');
  const spouseFirstLast = str(spouseParts[2] || '');
  const spouseSecondLast = str(spouseParts[3] || '');

  const payload: ProcessPayload = {
    process: {
      profile: {
        images: {
          Documentation: {
            frontPersonalDocument: docUrl(docs, 'dpi_front'),
            backPersonalDocument: docUrl(docs, 'dpi_back'),
          },
          PersonData: {
            personPhoto: docUrl(docs, 'client_photo'),
          },
          revisionApplicantInformation: {
            documents: [
              docUrl(docs, 'utility_bill'),
              docUrl(docs, 'additional_docs'),
            ].filter(Boolean),
          },
          business: {
            products,
          },
        },
        personalDocument: {
          personalDocumentId: cui,
          firstName,
          secondName,
          firstLastName,
          secondLastName,
          nationality,
          birthDate: yyyyMMdd(birthIso),
          birthDateMillis: birthMillis(birthIso),
          personalDocumentAddress: { fullAddress: addressFull },
          occupation: str(formData.profession),
          typeOfHousing: housingToEn(formData.houseOwnership),
          maritalStatus: maritalToEn(formData.maritalStatus),
          fullName: marriedOrUnion ? spouseName : '',
          spouseFirstName: marriedOrUnion ? spouseFirstName : '',
          spouseSecondName: marriedOrUnion ? spouseSecondName : '',
          spouseThirdName: '',
          spouseFirstLastName: marriedOrUnion ? spouseFirstLast : '',
          spouseSecondLastName: marriedOrUnion ? spouseSecondLast : '',
          spouseThirdLastName: '',
          spousePersonalDocumentId: marriedOrUnion ? str(formData.spouseDPI) : '',
          spouseOccupation: marriedOrUnion ? str(formData.spouseProfession) : '',
          spouseTotalIncome: marriedOrUnion ? num(formData.spouseIncome) : 0,
        },
        personData: {
          nit: str(formData.nit || formData.personalInfo?.nit),
          telephone: str(formData.homePhone),
          mobile: str(formData.mobilePhone),
          academicDegree: degreeMap(formData.educationLevel),
          email: emailAddress
            ? [{ emailAddress, emailType: 1, emailId: 'email-001' }]
            : [],
          personHasDependants: !!formData.hasDependents,
          numberOfDependants: num(formData.totalDependents),
          numberOfDependantsStudents: num(formData.studyingDependents),
          characterAnalysis: {
            historyOfViolenceOrAlcoholic: !!formData.hasAlcoholismOrViolence,
            livesInHighRiskZone: areaRiskLevel === 'alto' || !!formData.livesInHighRiskZone,
            moreThanTwoYearsResidence: !!formData.livesInSamePlaceTwoYears,
            spouseHasKnowledgeAboutTheCredit: !!formData.informedSpouseAboutFinancing,
            neighborsReferencesAreGood: neighborReferences === 'positivas' || !!formData.hasGoodNeighborReferences,
          },
          aboutTheProject: {
            applicantIsClearAboutPurposeOfCredit: creditPurposeClarityLevel === 'alta' || !!formData.hasCreditPurposeClarity,
            businessInHighRiskZone: !!formData.businessInHighRiskArea,
            businessMoreThanOneYear: businessAntiquity === 'mas_1a' || !!formData.businessOlderThanOneYear,
            businessHasOtherEconomicActivity: !!formData.hasOtherEconomicActivities,
            businessHasPurchaseAndSalesBook: recordKeepingLevel !== 'ninguno' && recordKeepingLevel !== undefined,
          },
          recordPayment: {
            sibGoodReferences: !!formData.hasSatisfactorySIBReferences,
            goodInternalScore: !!formData.hasInternalRatingAB,
          },
        },
        revisionApplicantInformation: {
          personIsApplicant: true,
          reason: str(formData.applicantRevisionReason),
        },
        productiveInformation: {
          personIsClient: !!formData.isInCreditNetwork,
        },
        productDetail: {
          productDefinition: productDefinitionMap(formData.productType),
          modality: modalityMap(formData.modality),
          requestedAmount: num(formData.requestedAmount),
          requestedInterestRate: num(formData.interestRate),
          requestedTerm: parseInt(str(formData.termMonths)) || 0,
          purpose: { itemId: '', value: str(formData.investmentDestination) },
          guarantee: str(formData.guarantee),
          investmentPlace: str(formData.investmentLocation),
        },
        business: {
          companyName: str(formData.businessName),
          businessAddress: { fullAddress: str(formData.businessAddress) },
          totalSales,
          costOfSales,
          grossProfit,
          administrativeExpenses,
          totalAdministrativeExpenses,
          netProfit,
        },
      },
    },
  };

  return payload;
}