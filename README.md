# WNFA Poster Generator

A publicly-available online version of the original WNFA project with its backend supported by Azure serverless computing products. The frontend is redesigned to adapt the new requimemnts.

For the backend, I removed tencent cloud OCR, and replaced tencent tmt with Azure translator. Art assets are now stored seperately on Azure storage, and an wrapper function is implementated on top of the Azure storage python SDK to ensure the poster program's access to art assets at runtime. I have also modified the program to pre-request art assets in batchs and taking advantage of the new python Asynchronous I/O with Azure Storage File Share Async client to reduce overhead. The backend code can be found here (https://github.com/aghnu/WNFA_azure_posters_gen)

The user interface is redesigned to look consistent with the WNFA Virtual Gallery, and the user input method is changed from taking a photo of a handwritten poem to directly type the poem. The frontend of the website is hosted on Azure Static Web App.

Here are some links:
- [WNFA Online Poster Generator](https://www.aghnu.me/WNFA)
- [The 3D virtual gallery for WNFA (Zhejiang Exhibition Hall from 06.01.2022 to 06.12.2022)](https://www.aghnu.me/gallery/WNFA)
- [Original WNFA project (Django)](https://github.com/aghnu/WNFA)

# Demo
<p align="left">
<img alt="gif_demo" width="100%" src=https://user-images.githubusercontent.com/46549455/182041209-8b61d765-70b7-45b3-8be9-6e40b5cf3ac6.png>
</p>

# Resources
- [Azure Storage File Share client library for Python](https://docs.microsoft.com/en-us/python/api/overview/azure/storage-file-share-readme?view=azure-python)

# License
    Copyright 2022 Gengyuan Huang

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
