import { Contact } from "@/types/contact";

export function getUniqueBatches(contacts: Contact[]): string[] {
  const batches = contacts
    .map(c => c.batch)
    .filter((batch): batch is string => !!batch);
  
  const uniqueBatches = Array.from(new Set(batches));
  
  // Sort batches numerically
  return uniqueBatches.sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    return numA - numB;
  });
}

export const getUniqueGenders = (contacts: Contact[]): string[] => {
  const genders = contacts
    .flatMap(c => c.gender || [])
    .filter(Boolean);
  return [...new Set(genders)].sort();
};

export const getUniqueBloodTypes = (contacts: Contact[]): string[] => {
  const bloodTypes = contacts
    .map(c => c.blood_type)
    .filter((type): type is string => !!type);
  return [...new Set(bloodTypes)].sort();
};
