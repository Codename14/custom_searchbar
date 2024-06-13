interface searchParamType {
    limit: string;
    term: string;
}
interface Concept {
    id: string;
}

interface Type {
    id: string;
}

interface DefinitionStatus {
    id: string;
}

interface Acceptability {
    [key: string]: string;
}

interface Pt {
    id: string;
    term: string;
    concept: Concept;
    type: Type;
    typeId: string;
    conceptId: string;
    acceptability: Acceptability;
}

interface SnomedConceptType {
    id: string;
    released: boolean;
    active: boolean;
    effectiveTime: string;
    moduleId: string;
    iconId: string;
    score: number;
    memberOf: string[];
    activeMemberOf: string[];
    definitionStatus: DefinitionStatus;
    subclassDefinitionStatus: string;
    pt: Pt;
    ancestorIds: string[];
    parentIds: string[];
    statedAncestorIds: string[];
    statedParentIds: string[];
    definitionStatusId: string;
}
