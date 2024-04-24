'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "f0761c51378e9dff7393acdaa5454172",
"index.html": "7f41ce26f28010265d0affdc4e6bb6ca",
"/": "7f41ce26f28010265d0affdc4e6bb6ca",
"main.dart.js": "5b446731fa7e849fbb0bc024c0fd0994",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "8bbc52da6d428d709470ee1ceb5bda68",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "1bd62257502badaf029945d9591b9d62",
"assets/AssetManifest.json": "85d393e0d60dadaa5b31f8ba4d276b10",
"assets/NOTICES": "25d1dffd5fc7c8a1cbfb457221af26f8",
"assets/FontManifest.json": "dd60f578fa521342e5395707565069c3",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.smcbin": "d28093917ba489ae6ac3baa6db8b340b",
"assets/fonts/MaterialIcons-Regular.otf": "62ec8220af1fb03e1c20cfa38781e17e",
"assets/assets/images/ic_java.png": "3cbd206c683054a3353a8ae6ea57086b",
"assets/assets/images/profile_img.png": "ff6bd98f6ccf7727d3494e8b83ea1040",
"assets/assets/images/ic_hand.png": "203b796f076cbac54f0003e7599f49e3",
"assets/assets/images/ic_kotlin.png": "b8639b770522677639e078752dfbd5de",
"assets/assets/images/ic_linkedin.png": "5d77693e40a57606108acba0b31bb19f",
"assets/assets/images/ic_light.png": "3df51f1d31d0b6693f516027353e5a32",
"assets/assets/images/ic_mobile.png": "9afb1d29e9e560dda8166c3f64c7015b",
"assets/assets/images/ic_gitlab.png": "68af79216ac102512e9beee12afd8933",
"assets/assets/images/ic_github.png": "db49200b113877e80d3ce2d1932a62c9",
"assets/assets/images/ic_books.png": "cd2c4c4334e63c1d6e5254f2a33afe06",
"assets/assets/images/ic_telegram.png": "2ea6395f8416d9f030080bd8216ad1b6",
"assets/assets/images/ic_dart.png": "1ef35f565a0da7c9f0bc58b06f7a8506",
"assets/assets/images/ic_android.png": "d4179e89f3126c388e23ddc60ef34488",
"assets/assets/images/ic_email.png": "87d1896469112fb42c79c292ff80eada",
"assets/assets/images/ic_emoji_pc.png": "d43d7a4896d15074c9b88cf9031b9121",
"assets/assets/images/ic_flutter.png": "74dde877cb4c805e166e6ade05c924fc",
"assets/assets/images/favicon_img.png": "8bbc52da6d428d709470ee1ceb5bda68",
"assets/assets/images/ic_python.png": "f57fa39f5e2a0dac32063b59fb954871",
"assets/assets/fonts/source_code_pro/SourceCodePro-Light.ttf": "5346a900d826a9ef52f17b77be75c183",
"assets/assets/fonts/source_code_pro/SourceCodePro-Regular.ttf": "d1f776b31a50ae68ace3819fdc58b065",
"assets/assets/fonts/caveat/Caveat-Bold.ttf": "628db1ff97c936e4c37d01d14c529159",
"assets/assets/fonts/roboto/Roboto-Light.ttf": "881e150ab929e26d1f812c4342c15a7c",
"assets/assets/fonts/roboto/Roboto-Regular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
