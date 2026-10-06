# readme-recent-projects

GitHub profil README'ndeki proje kartlarını her gün en son çalıştığın repolarla günceller ve commit'i **senin adınla** atar. Böylece hem profilin canlı kalır hem de her gün contribution grafiğine bir kare düşer.

*Keeps the project cards in your GitHub profile README in sync with your most recently pushed repos, committing daily as you.*

## Kurulum

1. Profil reposunu aç (kullanıcı adınla aynı isimli repo, ör. `kullaniciadin/kullaniciadin`).
2. README'de kartların görünmesini istediğin yere şunu ekle:

   ```html
   <!--RECENT:start-->
   <!--RECENT:end-->
   ```

   Eklemezsen bölüm README'nin sonuna `## Recent Projects` başlığıyla eklenir.

3. `.github/workflows/update-readme.yml` dosyasını oluştur:

   ```yaml
   name: Update README

   on:
     schedule:
       - cron: "17 6 * * *"
     workflow_dispatch:

   permissions:
     contents: write

   jobs:
     update:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: Livicianaa/readme-recent-projects@v1
   ```

4. Actions sekmesinden **Update README > Run workflow** ile ilk çalıştırmayı elle yap.

`17 6 * * *` her gün 06:17 UTC (Türkiye saatiyle 09:17) demek. GitHub zamanlanmış işleri yoğunlukta 10-30 dakika geciktirebilir.

## Ayarlar

| Input | Varsayılan | Açıklama |
| --- | --- | --- |
| `username` | repo sahibi | Repoları listelenecek kullanıcı |
| `limit` | `4` | Kart sayısı |
| `skip` | | Gizlenecek repo isimleri için regex, ör. `^(test-\|demo-)` |
| `theme` | `tokyonight` | [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) teması |
| `readme` | `README.md` | README yolu |
| `heading` | `## Recent Projects` | İşaretler yoksa eklenecek başlık |
| `commit-message` | `docs: refresh recent projects` | Commit mesajı |

Örnek:

```yaml
- uses: Livicianaa/readme-recent-projects@v1
  with:
    limit: 6
    skip: "^(ornek-|test-)"
    theme: radical
```

## Nasıl çalışır

- Public, fork olmayan ve arşivlenmemiş repoları son push tarihine göre sıralar; profil reposunun kendisini atlar.
- Kartları 2'li sıralar halinde `<!--RECENT:start-->` ile `<!--RECENT:end-->` arasına yazar.
- Bloğa görünmeyen bir tarih yorumu koyar, bu yüzden her gün bir değişiklik ve bir commit oluşur.
- Commit, hesabının noreply adresiyle (`ID+kullaniciadi@users.noreply.github.com`) atılır. Bot adıyla atılan commit'ler contribution grafiğine sayılmaz, bu sayılır.

## Sorun giderme

- **Push reddedildi (403):** workflow'da `permissions: contents: write` olduğundan emin ol.
- **Workflow durdu:** GitHub 60 gün hiç hareket olmayan public repolarda zamanlanmış işleri kapatır. Actions sekmesinden **Enable workflow** ile tekrar aç.
- **Kart "Something went wrong" diyor:** repo private ya da silinmiş; `skip` ile gizle.

## Lisans

MIT. Created by Liviciana.
