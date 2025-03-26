import {emptySearchParamsData, SearchParamsData} from "@/lib/types.ts";


export const getFromSearchParams = (searchParams: URLSearchParams, parameterName: string) => {
  const value = searchParams.get(parameterName)
  if (value === null) {
    return ""
  }
  return value
}
export const getListFromSearchParams = (searchParams: URLSearchParams, parameterName: string) => {
  const value = searchParams.get(parameterName);
  if (value === null) {
    return []
  }
  return value.split(",") || []
}

export const getAllSearchParamsWithData = (searchParams: URLSearchParams, data: SearchParamsData = emptySearchParamsData()) => {
  const params = {}

  if (data.instanceTypes.length > 0) {
    params["instances"] = data.instanceTypes.join(",")
  } else {
    const instances = getListFromSearchParams(searchParams, "instances")
    if (instances.length > 0) {
      params["instances"] = instances.join(",")
    }
  }

  if (data.subnetIds.length > 0) {
    params["subnetIds"] = data.subnetIds.join(",")
  } else {
    const subnetIds = getListFromSearchParams(searchParams, "subnetIds")
    if (subnetIds.length > 0) {
      params["subnetIds"] = subnetIds.join(",")
    }
  }

  if (data.accountId !== "") {
    params["accountId"] = data.accountId
  } else {
    const accountId = getFromSearchParams(searchParams, "accountId")
    if (accountId !== "") {
      params["accountId"] = accountId
    }
  }

  if (data.launchTemplateId !== "") {
    params["launchTemplateId"] = data.launchTemplateId
  } else {
    const launchTemplateId = getFromSearchParams(searchParams, "launchTemplateId")
    if (launchTemplateId !== "") {
      params["launchTemplateId"] = launchTemplateId
    }
  }

  if (data.targetCapacity !== 0) {
    params["targetCapacity"] = data.targetCapacity
  } else {
    const targetCapacity = getFromSearchParams(searchParams, "targetCapacity")
    if (targetCapacity !== "") {
      params["targetCapacity"] = targetCapacity
    }
  }

  return params
}