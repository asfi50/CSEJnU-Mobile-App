import { Contact } from "@/types/contact";

export const getUniqueBatches = (contacts: Contact[]): string[] => {
  const batches = contacts
    .map(c => c.batch)
    .filter((batch): batch is string => !!batch);
  return [...new Set(batches)].sort((a, b) => b.localeCompare(a)); // Sort descending
};

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
