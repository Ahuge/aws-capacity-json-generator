import {exportToVantageUrlProps} from "@/lib/props.ts";

const AWS_INSTANCE_PATTERN = /^[a-z0-9][a-z0-9.-]+$/i;
const VANTAGE_BASE_URL = 'https://instances.vantage.sh'

const validateInstanceTypes = (instances: string[]) => {
  return instances.filter(instance =>
    AWS_INSTANCE_PATTERN.test(instance) &&
    instance.length <= 32
  );
};

export const importFromVantage = (url: string) => {
  try {
    let isValid = true
    const parsedUrl = new URL(url);
    const searchParams = parsedUrl.searchParams;
    if (parsedUrl.origin !== VANTAGE_BASE_URL) {

      isValid = false
      throw "Bad host"
    }

    const rawFilter = searchParams.get('filter')?.split('|') || [];
    const rawSelected = searchParams.get('selected')?.split(',') || [];

    return {
      filter: validateInstanceTypes(rawFilter),
      selected: validateInstanceTypes(rawSelected),
      compareOn: searchParams.get('compare_on') === 'true',
      isValid: isValid
    };
  } catch (e) {
    return { filter: [], selected: [], compareOn: false, isValid: false };
  }
};

export const exportToVantageUrl = ({ filter, selected, compareOn = true }: exportToVantageUrlProps) => {
  const params: string[] = [];

  if (filter?.length) params.push(`filter=${filter.sort().reverse().join('|')}`);
  if (selected?.length) params.push(`selected=${selected.sort().reverse().join(',')}`);
  if (compareOn) params.push('compare_on=true');

  return params.length ? `${VANTAGE_BASE_URL}/?${params.join('&')}` : VANTAGE_BASE_URL;
};