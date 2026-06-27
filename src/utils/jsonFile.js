const emptyCompanyData = { companyData: [] };

const getFs = () => window.require('fs');
const getPath = () => window.require('path');

export const normalizeEnvPath = (filePath) => {
  if (!filePath) {
    throw new Error('JSON file path is missing in .env');
  }

  return String(filePath).trim().replace(/^['"]|['"]$/g, '');
};

const ensureCompanyShape = (data) => {
  if (!data || !Array.isArray(data.companyData)) {
    return { ...emptyCompanyData };
  }

  return data;
};

export const ensureJsonFile = async (filePath) => {
  const fs = getFs();
  const path = getPath();
  const normalizedPath = normalizeEnvPath(filePath);
  const directory = path.dirname(normalizedPath);

  await fs.promises.mkdir(directory, { recursive: true });

  try {
    await fs.promises.access(normalizedPath);
  } catch (err) {
    await fs.promises.writeFile(normalizedPath, JSON.stringify(emptyCompanyData, null, 2));
    return normalizedPath;
  }

  const content = await fs.promises.readFile(normalizedPath, 'utf8');
  if (!content.trim()) {
    await fs.promises.writeFile(normalizedPath, JSON.stringify(emptyCompanyData, null, 2));
  }

  return normalizedPath;
};

export const readCompanyFile = async (filePath) => {
  const fs = getFs();
  const normalizedPath = await ensureJsonFile(filePath);
  const content = await fs.promises.readFile(normalizedPath, 'utf8');
  const parsedData = JSON.parse(content);
  const data = ensureCompanyShape(parsedData);

  if (!Array.isArray(parsedData.companyData)) {
    await writeCompanyFile(filePath, data);
  }

  return data;
};

export const writeCompanyFile = async (filePath, data) => {
  const fs = getFs();
  const normalizedPath = await ensureJsonFile(filePath);
  await fs.promises.writeFile(normalizedPath, JSON.stringify(ensureCompanyShape(data), null, 2));
};

export const replaceCompanyData = async (filePath, companyData) => {
  await writeCompanyFile(filePath, { companyData });
};

export const ensureAllEnvJsonFiles = async () => {
  await Promise.all([
    ensureJsonFile(process.env.REACT_APP_INPUTFILE),
    ensureJsonFile(process.env.REACT_APP_INPUTBOXFILE),
    ensureJsonFile(process.env.REACT_APP_INPUTUNIVERSALFILE),
  ]);
};
