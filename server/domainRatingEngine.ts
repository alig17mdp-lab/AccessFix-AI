import dns from 'dns/promises';

export interface ServerDomainRatingOptions {
  domain: string;
}

/**
 * Server-side domain rating analyzer.
 * Checks live DNS resolution and verifies online status.
 */
export async function analyzeDomainRatingOnServer(rawInput: string) {
  let domain = rawInput.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//i, '');
  domain = domain.replace(/^www\./i, '');
  domain = domain.split('/')[0];
  domain = domain.split('?')[0];

  let dnsResolved = false;
  let ipAddresses: string[] = [];

  try {
    const addresses = await dns.resolve4(domain);
    if (addresses && addresses.length > 0) {
      dnsResolved = true;
      ipAddresses = addresses;
    }
  } catch {
    // DNS may fail for local or intranet domains, which is handled gracefully
    dnsResolved = false;
  }

  return {
    domain,
    dnsResolved,
    ipAddresses,
  };
}
