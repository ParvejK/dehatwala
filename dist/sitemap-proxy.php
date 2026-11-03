<?php
$source    = 'https://dehatwala.in/sitemap.xml';
$cacheFile = __DIR__ . '/sitemap-cache.xml';
$ttl       = 6 * 3600; // refresh every 6 hours

function fetchSitemap(string $url): ?string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_USERAGENT      => 'DehatwalaSitemapProxy/1.0',
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body !== false && $code === 200 && strpos($body, '<urlset') !== false) {
        return $body;
    }
    return null;
}

$xml = null;

if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
    $xml = file_get_contents($cacheFile);
} else {
    $xml = fetchSitemap($source);
    if ($xml !== null) {
        file_put_contents($cacheFile, $xml, LOCK_EX);
    } elseif (is_file($cacheFile)) {
        $xml = file_get_contents($cacheFile); // backend down: serve the old copy
    }
}

if ($xml === null) {
    http_response_code(503);
    header('Retry-After: 3600');
    exit('Sitemap temporarily unavailable.');
}

header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=3600');
echo $xml;